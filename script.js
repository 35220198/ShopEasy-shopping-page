/* ShopEasy - plain JavaScript: hero slider, product list, working cart, nav, contact form. */
(function () {
  "use strict";

  var PRODUCTS = [
    { id: "headphones", name: "Wireless Headphones", price: 49.99, icon: "\uD83C\uDFA7", bg: "linear-gradient(135deg,#e6e0ff,#c9bff7)", stars: 5 },
    { id: "watch",      name: "Smart Watch",         price: 79.99, icon: "\u231A",       bg: "linear-gradient(135deg,#d9ecff,#b4d6fb)", stars: 5 },
    { id: "shoes",      name: "Sports Shoes",        price: 59.99, icon: "\uD83D\uDC5F", bg: "linear-gradient(135deg,#ffe3d1,#ffc7a3)", stars: 5 },
    { id: "backpack",   name: "Travel Backpack",     price: 39.99, icon: "\uD83C\uDF92", bg: "linear-gradient(135deg,#d7f5e3,#a9e8c4)", stars: 4 },
    { id: "speaker",    name: "Bluetooth Speaker",   price: 34.99, icon: "\uD83D\uDD0A", bg: "linear-gradient(135deg,#ffe0f0,#ffb8dc)", stars: 4 },
    { id: "sunglasses", name: "Sunglasses",          price: 24.99, icon: "\uD83D\uDD76\uFE0F", bg: "linear-gradient(135deg,#fff3c4,#ffe27a)", stars: 4 }
  ];
  var SLIDES = [
    { title: "Shop Smarter,<br><em>Live Better</em>", text: "Discover amazing products at unbeatable prices." },
    { title: "Big Deals,<br><em>Up to 50% Off</em>", text: "Grab this week's top offers before they're gone." },
    { title: "Free Delivery,<br><em>Every Order</em>", text: "Shop what you love and we bring it to your door." },
    { title: "New Arrivals,<br><em>Every Day</em>", text: "Fresh picks added daily. Come back often." }
  ];
  var KEY = "shopeasy.cart.v1";

  var $ = function (id) { return document.getElementById(id); };
  var byId = {}; PRODUCTS.forEach(function (p) { byId[p.id] = p; });
  var money = function (n) { return "$" + n.toFixed(2); };

  /* ---------- cart state ---------- */
  var cart = loadCart();
  function loadCart() {
    try {
      var raw = JSON.parse(window.localStorage.getItem(KEY) || "{}"), out = {};
      Object.keys(raw).forEach(function (k) {
        var q = parseInt(raw[k], 10);
        if (byId[k] && q > 0) out[k] = Math.min(q, 99);
      });
      return out;
    } catch (e) { return {}; }
  }
  function saveCart() { try { window.localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }
  function count() { return Object.keys(cart).reduce(function (s, k) { return s + cart[k]; }, 0); }
  function total() { return Object.keys(cart).reduce(function (s, k) { return s + cart[k] * byId[k].price; }, 0); }

  /* ---------- toast ---------- */
  var toastTimer;
  function toast(msg) {
    var t = $("toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------- products ---------- */
  function renderProducts() {
    var box = $("products"); box.textContent = "";
    PRODUCTS.forEach(function (p) {
      var card = document.createElement("article"); card.className = "product";
      var thumb = document.createElement("div"); thumb.className = "thumb"; thumb.style.background = p.bg; thumb.textContent = p.icon;
      thumb.setAttribute("aria-hidden", "true");
      var h = document.createElement("h3"); h.textContent = p.name;
      var pr = document.createElement("div"); pr.className = "price"; pr.textContent = money(p.price);
      var st = document.createElement("div"); st.className = "stars";
      st.textContent = "\u2605\u2605\u2605\u2605\u2605".slice(0, p.stars) + "\u2606\u2606\u2606\u2606\u2606".slice(0, 5 - p.stars);
      st.setAttribute("aria-label", p.stars + " out of 5 stars");
      var b = document.createElement("button"); b.type = "button"; b.className = "add"; b.textContent = "Add to Cart";
      b.addEventListener("click", function () { addToCart(p.id, b); });
      [thumb, h, pr, st, b].forEach(function (el) { card.appendChild(el); });
      box.appendChild(card);
    });
  }
  function addToCart(id, btn) {
    cart[id] = Math.min((cart[id] || 0) + 1, 99);
    saveCart(); renderCart(true);
    toast(byId[id].name + " added to cart");
    if (btn) {
      btn.classList.add("done"); btn.textContent = "Added \u2713";
      setTimeout(function () { btn.classList.remove("done"); btn.textContent = "Add to Cart"; }, 1200);
    }
  }

  /* ---------- cart drawer ---------- */
  function renderCart(bump) {
    var n = count(), badge = $("cartCount");
    badge.textContent = n;
    if (bump) { badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump"); }
    $("cartBtn").setAttribute("aria-label", "Open cart, " + n + (n === 1 ? " item" : " items"));

    var list = $("cartList"); list.textContent = "";
    var ids = Object.keys(cart);
    if (!ids.length) {
      var li = document.createElement("li"); li.className = "empty"; li.textContent = "Your cart is empty. Add something you like!";
      list.appendChild(li);
    }
    ids.forEach(function (id) {
      var p = byId[id], li = document.createElement("li"); li.className = "cart-item";
      var th = document.createElement("div"); th.className = "ci-thumb"; th.style.background = p.bg; th.textContent = p.icon;
      var mid = document.createElement("div");
      var nm = document.createElement("div"); nm.className = "ci-name"; nm.textContent = p.name;
      var pr = document.createElement("div"); pr.className = "ci-price"; pr.textContent = money(p.price) + " each \u00B7 " + money(p.price * cart[id]);
      var q = document.createElement("div"); q.className = "qty";
      var minus = btn("\u2212", "Decrease quantity of " + p.name, function () { change(id, -1); });
      var num = document.createElement("span"); num.textContent = cart[id];
      var plus = btn("+", "Increase quantity of " + p.name, function () { change(id, 1); });
      [minus, num, plus].forEach(function (e) { q.appendChild(e); });
      [nm, pr, q].forEach(function (e) { mid.appendChild(e); });
      var rm = btn("\uD83D\uDDD1", "Remove " + p.name, function () { delete cart[id]; saveCart(); renderCart(); });
      rm.className = "rm";
      [th, mid, rm].forEach(function (e) { li.appendChild(e); });
      list.appendChild(li);
    });
    $("cartTotal").textContent = money(total());
    $("checkout").disabled = !ids.length;
    $("clearCart").hidden = !ids.length;
  }
  function btn(label, aria, fn) {
    var b = document.createElement("button"); b.type = "button"; b.textContent = label; b.setAttribute("aria-label", aria);
    b.addEventListener("click", fn); return b;
  }
  function change(id, d) {
    cart[id] = (cart[id] || 0) + d;
    if (cart[id] <= 0) delete cart[id]; else if (cart[id] > 99) cart[id] = 99;
    saveCart(); renderCart();
  }
  function openCart(open) {
    $("drawer").classList.toggle("open", open);
    $("overlay").classList.toggle("show", open);
    $("drawer").inert = !open;
    document.body.style.overflow = open ? "hidden" : "";
    if (open) $("closeCart").focus(); else $("cartBtn").focus();
  }
  $("cartBtn").addEventListener("click", function () { openCart(true); });
  $("closeCart").addEventListener("click", function () { openCart(false); });
  $("overlay").addEventListener("click", function () { openCart(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && $("drawer").classList.contains("open")) openCart(false); });
  $("clearCart").addEventListener("click", function () { cart = {}; saveCart(); renderCart(); });
  $("checkout").addEventListener("click", function () {
    var paid = money(total());
    cart = {}; saveCart(); renderCart(); openCart(false);
    toast("Order placed! You paid " + paid + ". Thank you!");
  });

  /* ---------- hero slider ---------- */
  var cur = 0, timer = null, dots = $("dots");
  SLIDES.forEach(function (s, i) {
    var b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "tab");
    b.setAttribute("aria-label", "Slide " + (i + 1));
    b.addEventListener("click", function () { show(i); restart(); });
    dots.appendChild(b);
  });
  function show(i) {
    cur = (i + SLIDES.length) % SLIDES.length;
    var copy = $("heroCopy"); copy.classList.add("swap");
    setTimeout(function () {
      $("heroTitle").innerHTML = SLIDES[cur].title;   // static, trusted strings above
      $("heroText").textContent = SLIDES[cur].text;
      copy.classList.remove("swap");
    }, 180);
    document.getElementById("home").classList.toggle("alt", cur % 2 === 1);
    Array.prototype.forEach.call(dots.children, function (d, k) { d.setAttribute("aria-selected", k === cur ? "true" : "false"); });
  }
  function restart() {
    clearInterval(timer);
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer = setInterval(function () { show(cur + 1); }, 5000);
  }
  dots.children[0].setAttribute("aria-selected", "true");
  restart();

  /* ---------- nav ---------- */
  var burger = $("burger"), links = $("navLinks");
  burger.addEventListener("click", function () {
    var open = links.classList.toggle("open"); burger.setAttribute("aria-expanded", open);
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { links.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
  });
  var sections = ["home", "shop", "about", "contact"].map(function (id) { return $(id); });
  function spy() {
    var y = window.scrollY + 100, active = "home";
    sections.forEach(function (s) { if (s.offsetTop <= y) active = s.id; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) active = "contact";
    Array.prototype.forEach.call(links.querySelectorAll("a"), function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + active);
    });
  }
  window.addEventListener("scroll", spy, { passive: true }); spy();

  /* ---------- contact form ---------- */
  $("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var n = $("cName").value.trim(), m = $("cEmail").value.trim(), t = $("cMsg").value.trim(), err = $("cErr");
    if (!n) { err.textContent = "Enter your name."; $("cName").focus(); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)) { err.textContent = "Enter a valid email address."; $("cEmail").focus(); return; }
    if (!t) { err.textContent = "Write a message."; $("cMsg").focus(); return; }
    err.textContent = ""; this.reset();
    toast("Thanks " + n + "! We'll reply soon.");
  });

  $("year").textContent = new Date().getFullYear();
  renderProducts();
  renderCart();
})();
