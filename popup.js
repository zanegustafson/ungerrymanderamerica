/* Ungerrymander America - subscribe popup
   Desktop: a centered popup with the Substack email form and a book button.
   Mobile (768px and under): a small bottom banner; tapping it opens the popup.

   Trigger: once the visitor scrolls past the hero section (.hero or .page-hero),
   after at least 2 seconds on the page. Pages with no hero use 40% scroll depth.
   After the popup is closed it stays hidden for 14 days (stored in the browser).

   To preview it any time, add ?popup=1 to a page address, for example
   https://ungerrymanderamerica.com/?popup=1

   To change the wording, edit the COPY block below. */
(function () {
    "use strict";
    if (window.__uaPopupLoaded) return;
    window.__uaPopupLoaded = true;

    /* ---------- Copy ---------- */
    var COPY = {
        title: "Get the latest analysis from Zane.",
        body: "Subscribe free to get each new essay, or read the full argument in the book.",
        bookButton: "Get the book: Polemic for Democracy",
        later: "No thanks",
        done: "I already subscribe",
        bannerTitle: "Stay in touch.",
        bannerBody: "Latest analysis from Zane.",
        bannerButton: "Subscribe"
    };

    /* ---------- Settings ---------- */
    var BOOK_URL = "https://shop.ingramspark.com/b/084?params=e6FpRlwhFaYMhOMP0kOZs4KAZhMdFoLGQEnx0oQp9Ob";
    var EMBED_URL = "https://ungerrymanderamerica.substack.com/embed";
    var STORAGE_KEY = "ua_popup_hidden_until";
    var DAYS_AFTER_CLOSE = 14;
    var DAYS_AFTER_BOOK = 90;
    var DAYS_AFTER_SUBSCRIBED = 365;
    var MIN_SECONDS_ON_PAGE = 2;
    var FALLBACK_SCROLL_DEPTH = 0.4;
    var MOBILE_QUERY = "(max-width: 768px)";
    var DAY_MS = 86400000;

    var forced = /[?&]popup=1(&|$)/.test(window.location.search);
    var startTime = Date.now();
    var passedTrigger = false;
    var shown = false;
    var lastFocus = null;
    var modal = null;
    var banner = null;

    /* ---------- Storage (fails safe if the browser blocks it) ---------- */
    function isHidden() {
        try {
            var until = parseInt(window.localStorage.getItem(STORAGE_KEY), 10);
            return !isNaN(until) && Date.now() < until;
        } catch (e) { return false; }
    }
    function hideFor(days) {
        try {
            // Only ever extend the hide time, so a later short close can't undo a longer one.
            var next = Date.now() + days * DAY_MS;
            var current = parseInt(window.localStorage.getItem(STORAGE_KEY), 10);
            if (isNaN(current) || next > current) {
                window.localStorage.setItem(STORAGE_KEY, String(next));
            }
        } catch (e) { /* ignore */ }
    }

    /* ---------- Styles (kept here so the popup never shows unstyled) ---------- */
    function addStyles() {
        var css = ""
            + ".ua-pop[hidden],.ua-banner[hidden]{display:none !important}"
            + ".ua-pop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px}"
            + ".ua-pop__backdrop{position:absolute;top:0;right:0;bottom:0;left:0;background:rgba(14,14,13,0.6);opacity:0;transition:opacity .2s ease}"
            + ".ua-pop__card{position:relative;box-sizing:border-box;width:100%;max-width:440px;max-height:calc(100vh - 32px);overflow:auto;background:#ffffff;color:#1c1c1a;border-top:6px solid #b073da;border-radius:14px;padding:30px 26px 20px;box-shadow:0 12px 36px rgba(0,0,0,0.3);opacity:0;transform:translateY(12px);transition:opacity .25s ease,transform .25s ease}"
            + ".ua-pop__card:focus{outline:none}"
            + ".ua-pop.is-open .ua-pop__backdrop{opacity:1}"
            + ".ua-pop.is-open .ua-pop__card{opacity:1;transform:none}"
            + ".ua-pop__x{position:absolute;top:8px;right:10px;width:36px;height:36px;border:0;background:none;color:#1c1c1a;font-size:28px;line-height:1;cursor:pointer;border-radius:8px}"
            + ".ua-pop__x:hover{background:#F4F2EE}"
            + ".ua-pop__title{margin:0 28px 8px 0;font-family:var(--font-heading,'Space Grotesk',sans-serif);font-size:25px;line-height:1.2;font-weight:700;color:#1c1c1a}"
            + ".ua-pop__body{margin:0 0 16px;font-family:var(--font-body,'Inter',sans-serif);font-size:16px;line-height:1.5;color:#1c1c1a}"
            + ".ua-pop__embed{margin:0 0 14px;min-height:150px}"
            + ".ua-pop__embed iframe{display:block;width:100%;height:150px;border:0;border-radius:8px;background:#F4F2EE}"
            + ".ua-pop__book{display:block;box-sizing:border-box;text-align:center;text-decoration:none;font-family:var(--font-body,'Inter',sans-serif);font-size:15px;font-weight:700;color:#1c1c1a;background:#F5F374;border-radius:8px;padding:12px 14px;margin:0 0 12px}"
            + ".ua-pop__book:hover{background:#e8e640}"
            + ".ua-pop__links{display:flex;justify-content:center;gap:18px;flex-wrap:wrap}"
            + ".ua-pop__link{border:0;background:none;padding:6px 4px;font-family:var(--font-body,'Inter',sans-serif);font-size:13px;color:#666660;text-decoration:underline;cursor:pointer}"
            + ".ua-pop__link:hover{color:#1c1c1a}"
            + ".ua-pop button:focus-visible,.ua-pop a:focus-visible,.ua-banner button:focus-visible{outline:3px solid #b073da;outline-offset:2px}"
            + "html.ua-pop-lock{overflow:hidden}"
            + ".ua-banner{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:900;box-sizing:border-box;display:flex;align-items:center;gap:10px;background:#1c1c1a;color:#ffffff;border-radius:12px;padding:12px 8px 12px 16px;box-shadow:0 6px 24px rgba(0,0,0,0.35);transform:translateY(160%);transition:transform .3s ease}"
            + ".ua-banner.is-open{transform:none}"
            + ".ua-banner__txt{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;font-family:var(--font-body,'Inter',sans-serif);font-size:13px;line-height:1.35;color:#ffffff}"
            + ".ua-banner__txt strong{font-family:var(--font-heading,'Space Grotesk',sans-serif);font-size:14px;color:#ffffff}"
            + ".ua-banner__go{flex-shrink:0;border:0;border-radius:8px;background:#F5F374;color:#1c1c1a;font-family:var(--font-body,'Inter',sans-serif);font-size:13px;font-weight:700;padding:10px 14px;cursor:pointer;white-space:nowrap}"
            + ".ua-banner__x{flex-shrink:0;border:0;background:none;color:#ffffff;font-size:26px;line-height:1;padding:4px 8px;cursor:pointer}"
            + "@media (prefers-reduced-motion:reduce){.ua-pop__backdrop,.ua-pop__card,.ua-banner{transition:none}}";
        var style = document.createElement("style");
        style.setAttribute("data-ua-popup", "");
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    /* ---------- Build the popup and banner ---------- */
    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text) node.textContent = text;
        return node;
    }

    function buildModal() {
        modal = el("div", "ua-pop");
        modal.hidden = true;
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("aria-labelledby", "ua-pop-title");

        var backdrop = el("div", "ua-pop__backdrop");
        backdrop.addEventListener("click", function () { closeModal(DAYS_AFTER_CLOSE); });

        var card = el("div", "ua-pop__card");
        card.tabIndex = -1;

        var x = el("button", "ua-pop__x", "\u00d7");
        x.type = "button";
        x.setAttribute("aria-label", "Close");
        x.addEventListener("click", function () { closeModal(DAYS_AFTER_CLOSE); });

        var title = el("h2", "ua-pop__title", COPY.title);
        title.id = "ua-pop-title";

        var body = el("p", "ua-pop__body", COPY.body);
        var embed = el("div", "ua-pop__embed");

        var book = el("a", "ua-pop__book", COPY.bookButton);
        book.href = BOOK_URL;
        book.target = "_blank";
        book.rel = "noopener";
        book.addEventListener("click", function () { hideFor(DAYS_AFTER_BOOK); });

        var links = el("div", "ua-pop__links");
        var later = el("button", "ua-pop__link", COPY.later);
        later.type = "button";
        later.addEventListener("click", function () { closeModal(DAYS_AFTER_CLOSE); });
        var done = el("button", "ua-pop__link", COPY.done);
        done.type = "button";
        done.addEventListener("click", function () { closeModal(DAYS_AFTER_SUBSCRIBED); });
        links.appendChild(later);
        links.appendChild(done);

        card.appendChild(x);
        card.appendChild(title);
        card.appendChild(body);
        card.appendChild(embed);
        card.appendChild(book);
        card.appendChild(links);
        modal.appendChild(backdrop);
        modal.appendChild(card);
        document.body.appendChild(modal);

        modal.addEventListener("keydown", trapFocus);
    }

    function buildBanner() {
        banner = el("div", "ua-banner");
        banner.hidden = true;
        banner.setAttribute("role", "region");
        banner.setAttribute("aria-label", "Subscribe");

        var txt = el("div", "ua-banner__txt");
        txt.appendChild(el("strong", "", COPY.bannerTitle));
        txt.appendChild(el("span", "", COPY.bannerBody));

        var go = el("button", "ua-banner__go", COPY.bannerButton);
        go.type = "button";
        go.addEventListener("click", function () {
            hideBanner();
            openModal();
        });

        var x = el("button", "ua-banner__x", "\u00d7");
        x.type = "button";
        x.setAttribute("aria-label", "Dismiss");
        x.addEventListener("click", function () {
            hideFor(DAYS_AFTER_CLOSE);
            hideBanner();
        });

        banner.appendChild(txt);
        banner.appendChild(go);
        banner.appendChild(x);
        document.body.appendChild(banner);
    }

    /* ---------- Open and close ---------- */
    function openModal() {
        if (!modal) buildModal();
        var embed = modal.querySelector(".ua-pop__embed");
        if (!embed.firstChild) {
            var frame = document.createElement("iframe");
            frame.src = EMBED_URL;
            frame.title = "Subscribe by email";
            frame.setAttribute("frameborder", "0");
            frame.setAttribute("scrolling", "no");
            embed.appendChild(frame);
        }
        lastFocus = document.activeElement;
        modal.hidden = false;
        document.documentElement.classList.add("ua-pop-lock");
        void modal.offsetWidth; // force a reflow so the fade-in animates
        modal.className = "ua-pop is-open";
        var card = modal.querySelector(".ua-pop__card");
        if (card) card.focus();
        document.addEventListener("keydown", onEscape);
    }

    function closeModal(days) {
        if (!modal || modal.hidden) return;
        hideFor(days);
        modal.hidden = true;
        modal.className = "ua-pop";
        document.documentElement.classList.remove("ua-pop-lock");
        document.removeEventListener("keydown", onEscape);
        if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) { /* ignore */ } }
    }

    function showBanner() {
        if (!banner) buildBanner();
        banner.hidden = false;
        void banner.offsetWidth; // force a reflow so the slide-up animates
        banner.className = "ua-banner is-open";
    }

    function hideBanner() {
        if (!banner) return;
        banner.hidden = true;
        banner.className = "ua-banner";
    }

    function onEscape(event) {
        if (event.key === "Escape" || event.keyCode === 27) closeModal(DAYS_AFTER_CLOSE);
    }

    /* Keep Tab inside the popup while it is open. */
    function trapFocus(event) {
        if (event.key !== "Tab" && event.keyCode !== 9) return;
        var items = modal.querySelectorAll("button, a[href], iframe");
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    /* ---------- When to show ---------- */
    function show() {
        if (shown) return;
        if (!forced && isHidden()) return;
        shown = true;
        if (window.matchMedia && window.matchMedia(MOBILE_QUERY).matches) {
            showBanner();
        } else {
            openModal();
        }
    }

    function tryShow() {
        if (shown || !passedTrigger) return;
        var wait = MIN_SECONDS_ON_PAGE * 1000 - (Date.now() - startTime);
        if (wait > 0) { window.setTimeout(show, wait); } else { show(); }
    }

    function watchScroll() {
        var hero = document.querySelector(".hero, .page-hero");
        if (hero && "IntersectionObserver" in window) {
            var observer = new IntersectionObserver(function (entries) {
                var entry = entries[0];
                // Past the hero means it is out of view and sitting above the screen.
                if (!entry.isIntersecting && entry.boundingClientRect.bottom <= 0) {
                    passedTrigger = true;
                    observer.disconnect();
                    tryShow();
                }
            });
            observer.observe(hero);
            return;
        }
        // No hero on this page: use scroll depth instead.
        function onScroll() {
            var doc = document.documentElement;
            var scrollable = doc.scrollHeight - window.innerHeight;
            if (scrollable <= 0) return;
            if ((window.pageYOffset || doc.scrollTop) / scrollable >= FALLBACK_SCROLL_DEPTH) {
                window.removeEventListener("scroll", onScroll);
                passedTrigger = true;
                tryShow();
            }
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    function init() {
        addStyles();
        if (forced) {
            passedTrigger = true;
            show();
            return;
        }
        if (isHidden()) return;
        watchScroll();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
