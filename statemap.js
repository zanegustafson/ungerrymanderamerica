/* Ungerrymander America - state map reveal
   Clicking a tile shows that state's map image(s) in a panel below the grid,
   plus a link to the interactive map on Dave's Redistricting. */
(function () {
    var BASE = "/images/TileMaps/";

    // Per state: dra link, and the list of images (file + caption).
    // Single-image states use one entry with an empty caption.
    var STATES = {
        ak: { name: "Alaska", dra: "https://davesredistricting.org/join/694ab3d1-3ce4-47c1-9cba-6ea86107d4b6", imgs: [["AK.png", ""]] },
        al: { name: "Alabama", dra: "https://davesredistricting.org/join/e7898a6f-ef6e-4e3f-9c87-f5bb91d1fd24", imgs: [["AL.png", ""]] },
        ar: { name: "Arkansas", dra: "https://davesredistricting.org/join/930302ef-b670-46cb-b295-018cfda94041", imgs: [["AR.png", ""]] },
        az: { name: "Arizona", dra: "https://davesredistricting.org/join/f1637eb7-f7e3-4723-b621-58925b2e18f0", imgs: [["AZ_Full.png", "Full state"], ["AZ_Pheonix.png", "Phoenix"]] },
        ca: { name: "California", dra: "https://davesredistricting.org/join/f99a041e-6c09-41b1-bcf7-eca753b72fd1", imgs: [["CA_Full.png", "Full state"], ["CA_BayArea.png", "Bay Area"], ["CA_LA.png", "Los Angeles"], ["CA_SanDiego.png", "San Diego"]] },
        co: { name: "Colorado", dra: "https://davesredistricting.org/join/b69e42f1-5b95-4964-bd79-98c6929b9dac", imgs: [["CO_Full.png", "Full state"], ["CO_Denver.png", "Denver"]] },
        ct: { name: "Connecticut", dra: "https://davesredistricting.org/join/63e382dd-18fd-4ef8-8743-d956057f84b3", imgs: [["CT.png", ""]] },
        dc: { name: "District of Columbia", dra: "https://davesredistricting.org/join/fcf19ca7-c49b-40ac-af9b-b568cd47e0e7", imgs: [["DC.png", ""]] },
        de: { name: "Delaware", dra: "https://davesredistricting.org/join/599c864d-e6c2-486b-beb8-0eefe85e0831", imgs: [["DE.png", ""]] },
        fl: { name: "Florida", dra: "https://davesredistricting.org/join/cedc43a1-c74e-483b-b654-07eaa3a4bd0c", imgs: [["FL_Full.png", "Full state"], ["FL_Miami.png", "Miami"], ["FL_Tampa.png", "Tampa"]] },
        ga: { name: "Georgia", dra: "https://davesredistricting.org/join/50374118-1af1-4744-897b-c6a02b32930d", imgs: [["GA_Full.png", "Full state"], ["GA_Atlanta.png", "Atlanta"]] },
        hi: { name: "Hawaii", dra: "https://davesredistricting.org/join/18078525-f830-45a5-b868-b23ea272d755", imgs: [["HI.png", ""]] },
        ia: { name: "Iowa", dra: "https://davesredistricting.org/join/c0c0ed77-a49e-483d-a392-a49cbb8bd29b", imgs: [["IA.png", ""]] },
        id: { name: "Idaho", dra: "https://davesredistricting.org/join/46a583c5-ca32-479b-9a67-e483b5d87bd7", imgs: [["ID.png", ""]] },
        il: { name: "Illinois", dra: "https://davesredistricting.org/join/2adbf69d-ad31-4d78-ad74-ea88e61c888a", imgs: [["IL_Full.png", "Full state"], ["IL_Chicago.png", "Chicago"]] },
        in: { name: "Indiana", dra: "https://davesredistricting.org/join/94557fc3-555b-40e7-a7c3-f603bdd0729d", imgs: [["IN.png", ""]] },
        ks: { name: "Kansas", dra: "https://davesredistricting.org/join/836c6bad-ad5f-4eb3-8cd6-d86cce414d32", imgs: [["KS.png", ""]] },
        ky: { name: "Kentucky", dra: "https://davesredistricting.org/join/da590f7a-442c-4952-aab7-8e28ed7b0ae1", imgs: [["KY.png", ""]] },
        la: { name: "Louisiana", dra: "https://davesredistricting.org/join/5faed0b0-d3f3-4090-a920-3ac3f7ff173a", imgs: [["LA.png", ""]] },
        ma: { name: "Massachusetts", dra: "https://davesredistricting.org/join/bd96ef5a-d41a-4c55-ac57-852eda31dbb3", imgs: [["MA.png", ""]] },
        md: { name: "Maryland", dra: "https://davesredistricting.org/join/0f58266f-9ce1-4614-8120-1570bc8cd59f", imgs: [["MD.png", ""]] },
        me: { name: "Maine", dra: "https://davesredistricting.org/join/388fb497-1ddb-4e7d-86d3-8faf14c3ecbd", imgs: [["ME.png", ""]] },
        mi: { name: "Michigan", dra: "https://davesredistricting.org/join/f6e09992-3501-479c-8af8-c93c20917065", imgs: [["MI_Full.png", "Full state"], ["MI_Detroit.png", "Detroit"]] },
        mn: { name: "Minnesota", dra: "https://davesredistricting.org/join/e6cc80c4-a60a-457a-9f24-da74dc2436b5", imgs: [["MN_Full.png", "Full state"], ["MN_TwinCities.png", "Twin Cities"]] },
        mo: { name: "Missouri", dra: "https://davesredistricting.org/join/01528a2b-80cb-4085-bd82-2ec44ea54765", imgs: [["MO_Full.png", "Full state"], ["MO_StLouis.png", "St. Louis"]] },
        ms: { name: "Mississippi", dra: "https://davesredistricting.org/join/d2b42358-d972-46ef-bf66-29b854e08b97", imgs: [["MS.png", ""]] },
        mt: { name: "Montana", dra: "https://davesredistricting.org/join/33678661-9b1a-471a-bc2a-47c8a062f5b0", imgs: [["MT.png", ""]] },
        nc: { name: "North Carolina", dra: "https://davesredistricting.org/join/764598bf-2ad4-4609-a1c2-1359352d1490", imgs: [["NC.png", ""]] },
        nd: { name: "North Dakota", dra: "https://davesredistricting.org/join/3bdea62c-84b8-407c-b108-b1a46d2dfee3", imgs: [["ND.png", ""]] },
        ne: { name: "Nebraska", dra: "https://davesredistricting.org/join/3e313671-e2c0-488a-aacc-9706273ca041", imgs: [["NE.png", ""]] },
        nh: { name: "New Hampshire", dra: "https://davesredistricting.org/join/90a9f42a-65c6-436c-8326-094c81e6d8d5", imgs: [["NH.png", ""]] },
        nj: { name: "New Jersey", dra: "https://davesredistricting.org/join/ba1b481f-bbed-4ace-9383-2c7d4108a0a1", imgs: [["NJ.png", ""]] },
        nm: { name: "New Mexico", dra: "https://davesredistricting.org/join/b5f711a2-eb9e-4e94-8c1c-9fc26b8a6e8c", imgs: [["NM.png", ""]] },
        nv: { name: "Nevada", dra: "https://davesredistricting.org/join/f839aa3a-1f1b-4ade-b94f-9c2abb477807", imgs: [["NV_Full.png", "Full state"], ["NV_LasVegas.png", "Las Vegas"]] },
        ny: { name: "New York", dra: "https://davesredistricting.org/join/68f48941-be15-4e61-8b1a-500aa628b354", imgs: [["NY_Full.png", "Full state"], ["NY_City.png", "New York City"]] },
        oh: { name: "Ohio", dra: "https://davesredistricting.org/join/8ffcfcbd-b801-4bcd-9a7a-1f57cdc7cc49", imgs: [["OH.png", ""]] },
        ok: { name: "Oklahoma", dra: "https://davesredistricting.org/join/d2fb8dae-ab63-4d35-a7ed-720d31d240b6", imgs: [["OK.png", ""]] },
        or: { name: "Oregon", dra: "https://davesredistricting.org/join/d48c86db-2edf-4976-af61-ca7540d12709", imgs: [["OR.png", ""]] },
        pa: { name: "Pennsylvania", dra: "https://davesredistricting.org/join/57f6a71b-3764-4825-9edb-3d3762b332b2", imgs: [["PA_Full.png", "Full state"], ["PA_Philadelphia.png", "Philadelphia"]] },
        pr: { name: "Puerto Rico", dra: "https://davesredistricting.org/join/7051f425-c771-4c4a-8e00-e17206aa3b52", imgs: [["PR.png", ""]] },
        ri: { name: "Rhode Island", dra: "https://davesredistricting.org/join/3379ec3d-e097-488e-9d16-5787997a21d5", imgs: [["RI.png", ""]] },
        sc: { name: "South Carolina", dra: "https://davesredistricting.org/join/0a9fdecf-9acd-4885-a212-119cea64d6a6", imgs: [["SC.png", ""]] },
        sd: { name: "South Dakota", dra: "https://davesredistricting.org/join/0f78dd04-0992-453d-86d8-61618197c76c", imgs: [["SD.png", ""]] },
        tn: { name: "Tennessee", dra: "https://davesredistricting.org/join/7704d754-4da8-42f1-be7d-9e5f0318d34d", imgs: [["TN.png", ""]] },
        tx: { name: "Texas", dra: "https://davesredistricting.org/join/6dfed37c-3aae-432d-bdf1-8a57bbf79beb", imgs: [["TX_Full.png", "Full state"], ["TX_Dallas.png", "Dallas"], ["TX_Houston.png", "Houston"], ["TX_SanAntonio.png", "San Antonio"]] },
        ut: { name: "Utah", dra: "https://davesredistricting.org/join/0dcbd3cd-7011-4c16-b778-93e0b5fd6e5a", imgs: [["UT.png", ""]] },
        va: { name: "Virginia", dra: "https://davesredistricting.org/join/f36ead1d-6bf6-4c54-b5d9-f0e8c5f39445", imgs: [["VA.png", ""]] },
        vt: { name: "Vermont", dra: "https://davesredistricting.org/join/b283a9b3-e567-4cae-9745-0f4a5fd11cca", imgs: [["VT.png", ""]] },
        wa: { name: "Washington", dra: "https://davesredistricting.org/join/3be87e42-4669-46aa-8607-8759e783c842", imgs: [["WA.png", ""]] },
        wi: { name: "Wisconsin", dra: "https://davesredistricting.org/join/8c3855f0-95a1-4e48-8ea8-4e2bfcf4c26c", imgs: [["WI_Full.png", "Full state"], ["WI_Milwaukee.png", "Milwaukee"]] },
        wv: { name: "West Virginia", dra: "https://davesredistricting.org/join/23cf7638-7b98-4f6b-92e3-eb320664c72f", imgs: [["WV.png", ""]] },
        wy: { name: "Wyoming", dra: "https://davesredistricting.org/join/9da727eb-f817-4b3d-8796-55934e05d0ba", imgs: [["WY.png", ""]] }
    };

    var panel = document.getElementById("statemap-reveal");
    if (!panel) return;
    var tiles = document.querySelectorAll(".tile[data-state]");
    var activeState = null;

    function buildPanel(code) {
        var s = STATES[code];
        if (!s) return "";
        var html = '<button class="statemap-reveal__close" aria-label="Close">&times;</button>';
        html += '<h4 class="statemap-reveal__name">' + s.name + '</h4>';
        html += '<div class="statemap-reveal__imgs">';
        for (var i = 0; i < s.imgs.length; i++) {
            var file = s.imgs[i][0];
            var cap = s.imgs[i][1];
            html += '<figure class="statemap-reveal__fig">';
            html += '<img src="' + BASE + file + '" alt="' + s.name + (cap ? " - " + cap : "") + ' fair map" loading="lazy">';
            if (cap) { html += '<figcaption>' + cap + '</figcaption>'; }
            html += '</figure>';
        }
        html += '</div>';
        html += '<figure class="statemap-reveal__legend"><img src="' + BASE + 'FourPartyLegend.png" alt="Four-party map color legend" loading="lazy"></figure>';
        html += '<a class="statemap-reveal__dra" href="' + s.dra + '" target="_blank" rel="noopener">Open the interactive map on Dave\u2019s Redistricting &rarr;</a>';
        return html;
    }

    function openState(code, tile) {
        panel.innerHTML = buildPanel(code);
        panel.hidden = false;
        activeState = code;
        tiles.forEach(function (t) { t.classList.remove("tile--active"); });
        if (tile) tile.classList.add("tile--active");
        var closeBtn = panel.querySelector(".statemap-reveal__close");
        if (closeBtn) closeBtn.addEventListener("click", closePanel);
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function closePanel() {
        panel.hidden = true;
        panel.innerHTML = "";
        activeState = null;
        tiles.forEach(function (t) { t.classList.remove("tile--active"); });
    }

    tiles.forEach(function (tile) {
        tile.addEventListener("click", function () {
            var code = tile.getAttribute("data-state");
            if (code === activeState) { closePanel(); }
            else { openState(code, tile); }
        });
    });
})();
