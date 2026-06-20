import { useState, useEffect, FormEvent } from "react";
import {
  ShoppingBag,
  Check,
  Plus,
  Minus,
  Shield,
  Star,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Truck,
  CreditCard,
  Lock,
  Camera,
  Droplet,
  Lightbulb,
  Cpu,
  CheckCircle2,
  Award,
  Sparkles,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Clock,
  PhoneCall,
  Mail,
  MapPin,
  Wrench
} from "lucide-react";

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  content: string;
  verified: boolean;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    author: "Mikołaj K.",
    rating: 5,
    date: "Wczoraj",
    content: "Mój najlepszy zakup do nowego mieszkania. Montaż zajął mi dosłownie kwadrans, a system działa niezawodnie. Kontrola oświetlenia i powiadomienia o zamkniętych zamkach dają super poczucie bezpieczeństwa.",
    verified: true
  },
  {
    id: 2,
    author: "Karolina W.",
    rating: 5,
    date: "3 dni temu",
    content: "Szukałam systemu bez drogiego abonamentu i skomplikowanego wiercenia ścian. Czujnik zalania pod pralką już raz uratował panele! Opcja wygenerowania PINu dla kuriera w zamkach to absolutna rewelacja.",
    verified: true
  },
  {
    id: 3,
    author: "Tomasz B.",
    rating: 4,
    date: "Tydzień temu",
    content: "Świetnej jakości komponenty, minimalistyczny wygląd i intuicyjna obsługa. Odjęcie jednej gwiazdki tylko za to, że kurier spóźnił się o jeden dzień, ale sam system Twój SMART Home to czyste złoto.",
    verified: true
  }
];

export default function App() {
  // Configurator state variables
  const [camsSingle, setCamsSingle] = useState(1);
  const [camsDual, setCamsDual] = useState(0);
  const [locks, setLocks] = useState(1);
  const [floods, setFloods] = useState(1);
  const [lights, setLights] = useState(2);

  // Promo Code State
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // overall percentage discount e.g. 10 for 10%
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  // Booking Flow Steps
  // 'config' | 'checkout' | 'success'
  const [checkoutStep, setCheckoutStep] = useState<"config" | "checkout" | "success">("config");

  // Lead Checkout Form State
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const deliveryMethod = "expert";
  const [paymentMethod, setPaymentMethod] = useState<"blik" | "card" | "cash">("blik");
  
  // Validation triggers
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Dynamic review catalog
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewContent, setNewReviewContent] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState("");

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccessMsg, setContactSuccessMsg] = useState("");

  // Auto coupon application notice toggle
  const [showPromoBadge, setShowPromoBadge] = useState(true);

  // Professional installation is standard and mandatory
  const includeInstallation = true;

  // Mock receipt/invoice data generated on successful order
  const [orderSummary, setOrderSummary] = useState<any>(null);

  // Base pricing declarations
  const HUB_PRICE = 499;
  const CAM_SINGLE_UNIT_PRICE = 199;
  const CAM_DUAL_UNIT_PRICE = 330;
  const LOCK_UNIT_PRICE = 349;
  const FLOOD_UNIT_PRICE = 129;
  const LIGHT_UNIT_PRICE = 99;

  // Real-time pricing calculations
  const camerasPrice = (camsSingle * CAM_SINGLE_UNIT_PRICE) + (camsDual * CAM_DUAL_UNIT_PRICE);
  const locksPrice = locks * LOCK_UNIT_PRICE;
  const floodsPrice = floods * FLOOD_UNIT_PRICE;
  const lightsPrice = lights * LIGHT_UNIT_PRICE;

  const subtotalItemsOnly = HUB_PRICE + camerasPrice + locksPrice + floodsPrice + lightsPrice;
  const totalItemCount = 1 + camsSingle + camsDual + locks + floods + lights;

  // Installation cost logic: 599 zł for up to 3 devices, 100 zł for each subsequent device
  const installationCost = includeInstallation ? (totalItemCount <= 3 ? 599 : 599 + (totalItemCount - 3) * 100) : 0;

  // Delivery is fully included in the professional installation service
  const deliveryCost = 0;

  const discountAmount = Math.round((subtotalItemsOnly * appliedDiscount) / 100);
  const finalTotalPrice = subtotalItemsOnly + installationCost - discountAmount + deliveryCost;

  // Quick promo code applicator helper
  const handleApplyPromo = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === "LUMI10" || trimmed === "SMART10" || trimmed === "SMART2026") {
      setAppliedDiscount(10);
      setPromoSuccess("Kod rabatowy SMART10 został pomyślnie aktywowany! Przyznano 10% zniżki.");
      setPromoError("");
    } else if (trimmed === "") {
      setPromoError("Wprowadź kod przed zatwierdzeniem.");
      setPromoSuccess("");
    } else {
      setPromoError("Wprowadzony kod jest niepoprawny lub wygasł.");
      setPromoSuccess("");
    }
  };

  // Checkout submission handler
  const handlePlaceOrder = (e: FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!fullname.trim()) errors.fullname = "Wpisz imię i nazwisko";
    if (!email.trim() || !email.includes("@")) errors.email = "Wpisz poprawny adres e-mail";
    if (!phone.trim() || phone.length < 9) errors.phone = "Wpisz poprawny numer telefonu (min. 9 cyfr)";
    if (!street.trim()) errors.street = "Ulica i numer budynku są wymagane";
    if (!postcode.trim() || !/^\d{2}-\d{3}$/.test(postcode)) errors.postcode = "Wpisz kod pocztowy w formacie 00-000";
    if (!city.trim()) errors.city = "Wpisz miasto";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // scroll to bottom to see form errors nicely
      const formEl = document.getElementById("order-form-container");
      formEl?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setFormErrors({});
    const randomOrderId = "SMART-" + Math.floor(100000 + Math.random() * 900000);
    const estDeliveryDate = new Date();
    estDeliveryDate.setDate(estDeliveryDate.getDate() + 3); // 3 days for scheduling and installation

    setOrderSummary({
      id: randomOrderId,
      date: new Date().toLocaleDateString("pl-PL"),
      fullname,
      email,
      phone,
      address: `${street}, ${postcode} ${city}`,
      deliveryMethodName: "Bezpłatny transport i wniesienie z montażem",
      paymentMethodName: paymentMethod === "blik" ? "Szybka płatność BLIK" : paymentMethod === "card" ? "Karta płatnicza" : "Płatność za pobraniem prza odbiorze",
      itemsOrdered: [
        { name: "Centralny Hub Sterujący Twój SMART Home (Baza)", qty: 1, price: HUB_PRICE },
        ...(camsSingle > 0 ? [{ name: "Kamera Bezprzewodowa SMART Home Cam (Singiel)", qty: camsSingle, price: camsSingle * CAM_SINGLE_UNIT_PRICE }] : []),
        ...(camsDual > 0 ? [{ name: "Kamera Bezprzewodowa SMART Home Cam (Dual)", qty: camsDual, price: camsDual * CAM_DUAL_UNIT_PRICE }] : []),
        ...(locks > 0 ? [{ name: "Zamek Smart Lock Twój SMART Home Lock", qty: locks, price: locksPrice }] : []),
        ...(floods > 0 ? [{ name: "Czujnik Zalania Twój SMART Home Flood", qty: floods, price: floodsPrice }] : []),
        ...(lights > 0 ? [{ name: "Żarówka RGB Smart Twój SMART Home Light", qty: lights, price: lightsPrice }] : []),
        ...(includeInstallation ? [{ name: `Profesjonalny montaż i konfiguracja (${totalItemCount} urządzeń)`, qty: 1, price: installationCost }] : [])
      ],
      deliveryCost,
      subtotal: subtotalItemsOnly + installationCost,
      discountAmount,
      finalTotalPrice,
      deliveryDate: estDeliveryDate.toLocaleDateString("pl-PL")
    });

    setCheckoutStep("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit product review handler
  const handleAddReview = (e: FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim()) {
      alert("Proszę wpisać swoje imię lub inicjały.");
      return;
    }
    if (!newReviewContent.trim() || newReviewContent.length < 5) {
      alert("Napisz dłuższą opinię (min. 5 znaków).");
      return;
    }

    const added: Review = {
      id: Date.now(),
      author: newReviewAuthor,
      rating: newReviewRating,
      date: "Przed chwilą",
      content: newReviewContent,
      verified: true
    };

    setReviews([added, ...reviews]);
    setNewReviewAuthor("");
    setNewReviewContent("");
    setNewReviewRating(5);
    setReviewSuccessMsg("Dziękujemy! Twoja opinia została pomyślnie dodana poniżej.");
    setTimeout(() => setReviewSuccessMsg(""), 5000);
  };

  // Contact Form submit handler
  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      alert("Proszę wypełnić wszystkie wymagane pola (Imię, E-mail, Wiadomość).");
      return;
    }

    setIsSubmittingContact(true);
    setContactSuccessMsg("");

    try {
      const response = await fetch("https://formsubmit.co/ajax/DreamStudiopl@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          message: contactMessage,
          _subject: "Nowe zgłoszenie z landing page Twój SMART Home"
        })
      });

      if (response.ok) {
        setContactSuccessMsg("Dziękujemy! Twoja wiadomość została pomyślnie wysłana bezpośrednio na adres DreamStudiopl@gmail.com. Skontaktujemy się z Tobą wkrótce!");
        setContactName("");
        setContactEmail("");
        setContactPhone("");
        setContactMessage("");
      } else {
        throw new Error("Wysłanie nie powiodło się");
      }
    } catch (error) {
      // Fallback: system email alert or alternative presentation
      setContactSuccessMsg("Wystąpił błąd podczas wysyłania przez formularz. Możesz napisać do nas bezpośrednio na: DreamStudiopl@gmail.com");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleReset = () => {
    setCamsSingle(1);
    setCamsDual(0);
    setLocks(1);
    setFloods(1);
    setLights(2);
    setPromoCode("");
    setAppliedDiscount(0);
    setPromoSuccess("");
    setPromoError("");
    setCheckoutStep("config");
    setFullname("");
    setEmail("");
    setPhone("");
    setStreet("");
    setPostcode("");
    setCity("");
  };

  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
      
      {/* Top Banner Offer */}
      {showPromoBadge && (
        <div className="bg-zinc-950 text-white text-[11px] font-bold tracking-wider py-2 uppercase px-4 text-center relative flex justify-center items-center">
          <span>🎁 Wyjątkowa oferta: Profesjonalny montaż i bezpłatny transport + 10% rabatu z kodem <strong className="bg-white/10 px-2 py-0.5 rounded font-mono border border-white/20">SMART10</strong></span>
          <button 
            onClick={() => setShowPromoBadge(false)} 
            className="absolute right-4 hover:opacity-75 focus:outline-none p-1 font-mono text-xs cursor-pointer"
            title="Zamknij"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Container Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-zinc-100 sticky top-0 z-50 transition-all">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-black text-lg tracking-tighter text-zinc-950 flex items-center gap-1.5 focus:outline-none cursor-pointer" onClick={() => setCheckoutStep("config")}>
              Twój SMART<span className="font-light text-zinc-500"> Home</span>
            </span>
            <span className="text-[9px] bg-zinc-100 text-zinc-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans border border-zinc-200">
              ORIGINAL KIT
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-zinc-650 uppercase tracking-wider">
            <a href="#cechy" className="hover:text-zinc-950 transition-colors">Zalety</a>
            <a href="#konfigurator" className="hover:text-zinc-950 transition-colors">Kreator zestawu</a>
            <a href="#opinie" className="hover:text-zinc-950 transition-colors">Referencje</a>
            <a href="#kontakt" className="hover:text-zinc-950 transition-colors">Kontakt</a>
          </nav>

          <div className="flex items-center gap-3">
            <a 
              href="#konfigurator" 
              className="bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold py-2.5 px-5 rounded-xl uppercase tracking-wider transition-all shadow-3xs cursor-pointer flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Skonfiguruj
            </a>
          </div>
        </div>
      </header>

      {/* Hero section */}
      {checkoutStep === "config" && (
        <section className="py-12 md:py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          {/* Left Text Detail */}
          <div className="md:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 rounded-full text-xs font-extrabold text-zinc-800 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-zinc-900" /> Najprostsze Smart Home na rynku
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 leading-[1.1]">
              Twój dom. Mądrzejszy, Bezpieczniejszy i Funkcjonalny!
            </h1>
            
            <p className="text-sm md:text-base text-zinc-500 leading-relaxed max-w-lg">
              System <strong>Twój SMART Home</strong> to rewolucja w domowej automatyzacji. Całkowicie bezprzewodowe elementy instalowane bezpośrednio przez naszą firmę. Bez kucia ścian, bez zmartwień i bez dodatkowych opłat abonamentowych.
            </p>

            {/* Micro Rating Indicator */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-zinc-100 inline-block shadow-3xs">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current text-amber-500" />
                ))}
              </div>
              <span className="text-xs font-extrabold text-zinc-900 font-mono">4.9/5</span>
              <span className="text-[11px] text-zinc-400 font-bold border-l border-zinc-150 pl-3">Ponad 180 zadowolonych klientów!</span>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a 
                href="#konfigurator" 
                className="bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold py-3.5 px-7 rounded-xl uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
              >
                Stwórz własny zestaw <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="#cechy" 
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold py-3.5 px-7 rounded-xl uppercase tracking-wider transition-all"
              >
                Zobacz jak to działa
              </a>
            </div>
          </div>

          {/* Right visual picture card */}
          <div className="md:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden border border-zinc-200 shadow-xl bg-white p-2">
              <img 
                src="/src/assets/images/lumi_smart_home_hero_1781940181820.jpg" 
                alt="Inteligentny dom Twój SMART Home Hub" 
                className="w-full h-auto object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Ambient spec badge info overlay */}
            <div className="absolute -bottom-5 -right-3 md:-right-5 bg-zinc-950 text-white rounded-2xl p-4 shadow-xl border border-zinc-900 flex items-center gap-3 max-w-xs transition-transform hover:scale-105">
              <div className="p-2.5 bg-zinc-900 rounded-xl">
                <Cpu className="w-5 h-5 text-white stroke-[1.75]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">SMART Core Hub</p>
                <p className="text-xs font-bold leading-tight">Wszystkie moduły łączą się automatycznie na odległość do 100 metrów!</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main product specs list */}
      {checkoutStep === "config" && (
        <section id="cechy" className="py-16 bg-white border-y border-zinc-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-950 tracking-tight">
                Dlaczego warto wybrać Twój SMART Home?
              </h2>
              <p className="text-zinc-500 text-xs md:text-sm mt-2">
                Trzy fundamenty nowoczesnego zarządzania domem: zero problematycznych instalacji, zero abonamentów, pełne zaufanie.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Feature card point 1 */}
              <div className="p-6 rounded-2xl border border-zinc-150/80 bg-zinc-50/30 flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-zinc-100 text-zinc-950 rounded-xl w-fit mb-4 border border-zinc-200">
                    <Check className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h3 className="font-extrabold uppercase tracking-wider text-[11px] text-zinc-900">Bezinwazyjny montaż w cenie</h3>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                    Nasi certyfikowani instalatorzy bezinwazyjnie zamontują i skonfigurują wszystkie elementy. Czysto, szybko i bez zmartwień!
                  </p>
                </div>
              </div>

              {/* Feature card point 2 */}
              <div className="p-6 rounded-2xl border border-zinc-150/80 bg-zinc-50/30 flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-zinc-100 text-zinc-950 rounded-xl w-fit mb-4 border border-zinc-200">
                    <Shield className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h3 className="font-extrabold uppercase tracking-wider text-[11px] text-zinc-900">Brak opłat abonamentowych</h3>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                    Kupujesz urządzenie raz na zawsze. Otrzymujesz powiadomienia na telefon, nagrania z kamer w technologii offline i darmową aplikację całkowicie za darmo.
                  </p>
                </div>
              </div>

              {/* Feature card point 3 */}
              <div className="p-6 rounded-2xl border border-zinc-150/80 bg-zinc-50/30 flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-zinc-100 text-zinc-950 rounded-xl w-fit mb-4 border border-zinc-200">
                    <Sparkles className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h3 className="font-extrabold uppercase tracking-wider text-[11px] text-zinc-900">Sceny SmartRule</h3>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                    Zasada synergii: gdy sensor zalania wykryje wodę, centrala automatycznie zarygluje klamki i włączy oświetlenie ostrzegawcze. Wszystko zintegrowane.
                  </p>
                </div>
              </div>

              {/* Feature card point 4 */}
              <div className="p-6 rounded-2xl border border-zinc-150/80 bg-zinc-50/30 flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-zinc-100 text-zinc-950 rounded-xl w-fit mb-4 border border-zinc-200">
                    <Clock className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h3 className="font-extrabold uppercase tracking-wider text-[11px] text-zinc-900">Ultra-wydajne baterie</h3>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                    Nigdy więcej ciągłych ładowań. Energooszczędny procesor sprawia, że baterie w czujkach i zamkach wytrzymują od 12 do 24 miesięcy ciągłej pracy.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Booking flow layout builder */}
      <section id="konfigurator" className="py-16 max-w-6xl mx-auto px-6">
        
        {checkoutStep === "success" && orderSummary ? (
          /* High-end receipt page if checked out successfully */
          <div className="max-w-xl mx-auto bg-white border border-zinc-150 rounded-3xl p-6 md:p-8 shadow-md">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                <CheckCircle2 className="w-6 h-6 stroke-[2]" />
              </div>
              <h2 className="text-2xl font-black text-zinc-950 leading-tight">Dziękujemy za zamówienie!</h2>
              <p className="text-xs text-zinc-400 mt-1 capitalize">Twój kod zamówienia: <span className="font-mono font-bold text-zinc-800">{orderSummary.id}</span></p>
            </div>

            <div className="bg-zinc-50 rounded-2xl p-4.5 border border-zinc-100 text-xs space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-zinc-400">Data zamówienia:</span>
                <span className="font-bold text-zinc-850">{orderSummary.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Zamawiający:</span>
                <span className="font-bold text-zinc-850">{orderSummary.fullname}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Adres dostawy i montażu:</span>
                <span className="font-bold text-zinc-850 text-right max-w-[200px] truncate" title={orderSummary.address}>{orderSummary.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Metoda płatności:</span>
                <span className="font-bold text-zinc-850">{orderSummary.paymentMethodName}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-200">
                <span className="text-zinc-400 font-semibold">Gwarantowany termin montażu:</span>
                <span className="font-bold text-zinc-950 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{orderSummary.deliveryDate}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-zinc-400 border-b border-zinc-100 pb-1">Specyfikacja zamówienia</h4>
              
              {orderSummary.itemsOrdered.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-xs py-1">
                  <span className="text-zinc-650">{item.name} <strong className="text-zinc-905">x{item.qty}</strong></span>
                  <span className="text-zinc-900 font-bold font-mono">{item.price} zł</span>
                </div>
              ))}

              <div className="flex justify-between text-xs py-1 border-t border-zinc-100 pt-2">
                <span className="text-zinc-450">Opłata za transport i dojazd:</span>
                <span className="text-zinc-900 font-bold font-mono">
                  Darmowa
                </span>
              </div>
              {orderSummary.discountAmount > 0 && (
                <div className="flex justify-between text-xs py-1 text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                  <span>Zastosowany kod rabatowy (10%):</span>
                  <span className="font-bold font-mono">-{orderSummary.discountAmount} zł</span>
                </div>
              )}

              <div className="flex justify-between text-base py-3 border-t border-dashed border-zinc-200 mt-2 font-black text-zinc-950">
                <span>Do zapłaty łącznie:</span>
                <span className="font-mono text-lg">{orderSummary.finalTotalPrice} zł</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all shadow-3xs cursor-pointer text-center"
              >
                Konfiguruj nowy zestaw
              </button>
            </div>
          </div>
        ) : (
          /* Normal kit configuration state */
          <div>
            <div className="text-center max-w-xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-zinc-100 rounded-full text-[10px] font-extrabold text-zinc-800 uppercase tracking-widest mb-2">
                Zbuduj swój inteligentny dom
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-950 tracking-tight">
                Interaktywny Kreator Zestawu
              </h2>
              <p className="text-zinc-500 text-xs md:text-sm mt-1">
                Wybierz dowolną liczbę elementów, a serce systemu — Centralę Sterującą (Hub) — otrzymasz już w pakiecie podstawowym.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column Configurator Options - Grid 7 */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* 1. Base Hub Card (fixed) */}
                <div className="bg-white p-5 rounded-2xl border border-zinc-150 flex items-center justify-between shadow-3xs relative overflow-hidden">
                  <div className="absolute right-0 top-0 bg-zinc-900 text-white text-[9px] font-bold py-1 px-3 uppercase tracking-wider rounded-bl-xl font-mono">
                    W zestawie
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-50 text-zinc-900 border border-zinc-150 rounded-xl">
                      <Cpu className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5">
                        Centrala Inteligentnego Domu Twój SMART Home Hub
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Serce systemu, łączy moduły w bezpieczną sieć bezprzewodową. Zapewnia powiadomienia push i sterowanie.
                      </p>
                    </div>
                  </div>
                  <div className="text-right pl-4">
                    <span className="font-mono text-sm font-black text-zinc-900 whitespace-nowrap">{HUB_PRICE} zł</span>
                    <p className="text-[10px] text-zinc-400 tracking-wider font-bold">1 SZTUKA</p>
                  </div>
                </div>

                {/* 2. Cams Controller */}
                <div className="bg-white p-5 rounded-2xl border border-zinc-150 flex flex-col gap-4 shadow-3xs hover:border-zinc-300 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-zinc-50 text-zinc-900 border border-zinc-150 rounded-xl shrink-0">
                      <Camera className="w-5 h-5 text-zinc-950 stroke-[1.75]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5">
                        Kamery Bezprzewodowe Twój SMART Home Cam HD
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Bezprzewodowe kamery z wbudowanym trybem nocnym (IR), detekcją ruchu i zasilaniem akumulatorowym. Wybierz wersję Singiel, Dual lub obie jednocześnie!
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-zinc-100 pt-3 space-y-4">
                    {/* Wersja Singiel Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-extrabold text-zinc-900 uppercase tracking-wide">Wersja Singiel</span>
                          <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md font-mono font-bold">199 zł / szt.</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Podstawowy obiektyw HD 1080p, szeroki kąt widzenia 110°.</p>
                      </div>
                      <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-150 p-1 rounded-lg self-end sm:self-center">
                        <button 
                          type="button"
                          onClick={() => setCamsSingle(Math.max(0, camsSingle - 1))}
                          className="w-7 h-7 rounded-md bg-white hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-700 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-extrabold w-4 text-center text-zinc-900">{camsSingle}</span>
                        <button 
                          type="button"
                          onClick={() => setCamsSingle(Math.min(5, camsSingle + 1))}
                          className="w-7 h-7 rounded-md bg-white hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-700 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Wersja Dual Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-dashed border-zinc-150">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-extrabold text-zinc-900 uppercase tracking-wide">Wersja Dual</span>
                          <span className="text-[10px] bg-zinc-950 text-white px-2 py-0.5 rounded-md font-mono font-bold">330 zł / szt.</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Podwójny obiektyw ze śledzeniem ruchu i zoomem optycznym.</p>
                      </div>
                      <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-150 p-1 rounded-lg self-end sm:self-center">
                        <button 
                          type="button"
                          onClick={() => setCamsDual(Math.max(0, camsDual - 1))}
                          className="w-7 h-7 rounded-md bg-white hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-700 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-extrabold w-4 text-center text-zinc-900">{camsDual}</span>
                        <button 
                          type="button"
                          onClick={() => setCamsDual(Math.min(5, camsDual + 1))}
                          className="w-7 h-7 rounded-md bg-white hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-700 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Locks Controller */}
                <div className="bg-white p-5 rounded-2xl border border-zinc-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-3xs hover:border-zinc-300 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-zinc-50 text-zinc-900 border border-zinc-150 rounded-xl shrink-0">
                      <Lock className="w-5 h-5 text-zinc-950 stroke-[1.75]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5">
                        Zamek Smart Lock Twój SMART Home Lock
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Bezpieczny rygiel elektromechaniczny na drzwi wejściowe. Otwieranie kodem PIN (goście), aplikacją lub brelokiem NFC.
                      </p>
                      <span className="inline-block mt-2 font-mono text-[11px] font-bold text-zinc-550">+{LOCK_UNIT_PRICE} zł za sztukę</span>
                    </div>
                  </div>
                  
                  {/* Plus/minus buttons */}
                  <div className="flex items-center gap-3.5 self-end sm:self-center bg-zinc-50 border border-zinc-150 p-1.5 rounded-xl">
                    <button 
                      onClick={() => setLocks(Math.max(0, locks - 1))}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-700 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-extrabold w-5 text-center text-zinc-900">{locks}</span>
                    <button 
                      onClick={() => setLocks(Math.min(4, locks + 1))}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-700 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 4. Water Leak Sensors */}
                <div className="bg-white p-5 rounded-2xl border border-zinc-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-3xs hover:border-zinc-300 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-zinc-50 text-zinc-900 border border-zinc-150 rounded-xl shrink-0">
                      <Droplet className="w-5 h-5 text-zinc-950 stroke-[1.75]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5">
                        Czujnik Zalania Twój SMART Home Flood
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Kompaktowy detektor cieczy do kuchni, łazienki lub kotłowni. Błyskawicznie alarmuje w przypadku pierwszej nieszczelności rury.
                      </p>
                      <span className="inline-block mt-2 font-mono text-[11px] font-bold text-zinc-550">+{FLOOD_UNIT_PRICE} zł za sztukę</span>
                    </div>
                  </div>
                  
                  {/* Plus/minus buttons */}
                  <div className="flex items-center gap-3.5 self-end sm:self-center bg-zinc-50 border border-zinc-150 p-1.5 rounded-xl">
                    <button 
                      onClick={() => setFloods(Math.max(0, floods - 1))}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-700 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-extrabold w-5 text-center text-zinc-900">{floods}</span>
                    <button 
                      onClick={() => setFloods(Math.min(8, floods + 1))}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-700 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 5. Smart RGB Lights bulb */}
                <div className="bg-white p-5 rounded-2xl border border-zinc-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-3xs hover:border-zinc-300 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-zinc-50 text-zinc-900 border border-zinc-150 rounded-xl shrink-0">
                      <Lightbulb className="w-5 h-5 text-zinc-950 stroke-[1.75]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5">
                        Żarówka RGB Smart Twój SMART Home Light
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Zmień barwę i jasność oświetlenia według humoru. Pełne spektrum barw RGB, ciepłe-zimne odcienie bieli, standardowy gwint E27.
                      </p>
                      <span className="inline-block mt-2 font-mono text-[11px] font-bold text-zinc-550">+{LIGHT_UNIT_PRICE} zł za sztukę</span>
                    </div>
                  </div>
                  
                  {/* Plus/minus buttons */}
                  <div className="flex items-center gap-3.5 self-end sm:self-center bg-zinc-50 border border-zinc-150 p-1.5 rounded-xl">
                    <button 
                      onClick={() => setLights(Math.max(0, lights - 1))}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-700 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-extrabold w-5 text-center text-zinc-900">{lights}</span>
                    <button 
                      onClick={() => setLights(Math.min(12, lights + 1))}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-700 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 6. Professional installation and configuration */}
                <div className="bg-white p-5 rounded-2xl border border-zinc-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-3xs hover:border-zinc-300 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-zinc-50 text-zinc-900 border border-zinc-150 rounded-xl shrink-0">
                      <Wrench className="w-5 h-5 text-zinc-950 stroke-[1.75]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5">
                        Profesjonalny montaż i konfiguracja przez Dream Studio (Wymagany)
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Ze względów bezpieczeństwa i gwarancji prawidłowego działania systemu, jedyną dostępną formą instalacji jest montaż przez naszych ekspertów. Konfiguracja centrali, testy poprawności, kalibracja kamer oraz zamków w cenie.
                      </p>
                      <span className="inline-block mt-2 font-mono text-[11px] font-bold text-zinc-550">
                        {totalItemCount <= 3 ? "599 zł * (do 3 urządzeń)" : `599 zł + ${(totalItemCount - 3) * 100} zł = ${599 + (totalItemCount - 3) * 100} zł * (${totalItemCount} urządzeń)`}
                      </span>
                      <p className="text-[9px] text-zinc-400 mt-0.5 font-semibold">
                        * Bazowo 599 zł do 3 urządzeń, każde kolejne +100 zł (wliczając bazę centralną)
                      </p>
                    </div>
                  </div>
                  
                  {/* Option display (Mandatory) */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 text-white rounded-xl text-[10px] font-black uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Wydajny montaż
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column Summary & Interactive Checkout Form - Grid 5 */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Visual live order value breakdown */}
                <div className="bg-white p-6 rounded-3xl border border-zinc-150 shadow-sm space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-950 pb-2 border-b border-zinc-100 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-zinc-950" /> Podsumowanie zestawu
                  </h3>

                  <div className="space-y-3.5 text-xs">
                    
                    <div className="flex justify-between font-mono">
                      <span className="text-zinc-500">1x Baza Centralna Twój SMART Home Hub</span>
                      <span className="font-bold text-zinc-900">{HUB_PRICE} zł</span>
                    </div>

                    {camsSingle > 0 && (
                      <div className="flex justify-between font-mono">
                        <span className="text-zinc-500">{camsSingle}x Kamera SMART Home (Singiel)</span>
                        <span className="font-bold text-zinc-900">+{camsSingle * CAM_SINGLE_UNIT_PRICE} zł</span>
                      </div>
                    )}

                    {camsDual > 0 && (
                      <div className="flex justify-between font-mono">
                        <span className="text-zinc-500">{camsDual}x Kamera SMART Home (Dual)</span>
                        <span className="font-bold text-zinc-900">+{camsDual * CAM_DUAL_UNIT_PRICE} zł</span>
                      </div>
                    )}

                    {locks > 0 && (
                      <div className="flex justify-between font-mono">
                        <span className="text-zinc-500">{locks}x Inteligentny Zamek</span>
                        <span className="font-bold text-zinc-900">+{locksPrice} zł</span>
                      </div>
                    )}

                    {floods > 0 && (
                      <div className="flex justify-between font-mono">
                        <span className="text-zinc-500">{floods}x Czujnik Zalania</span>
                        <span className="font-bold text-zinc-900">+{floodsPrice} zł</span>
                      </div>
                    )}

                    {lights > 0 && (
                      <div className="flex justify-between font-mono">
                        <span className="text-zinc-500">{lights}x Żarówka Smart RGB</span>
                        <span className="font-bold text-zinc-900">+{lightsPrice} zł</span>
                      </div>
                    )}

                    <div className="flex justify-between font-mono bg-zinc-50 p-2 rounded-xl border border-zinc-100 text-[11px] items-center text-zinc-650">
                      <span className="flex items-center gap-1 font-semibold">🔧 Montaż i konfiguracja (Wymagany — {totalItemCount} urządz.):</span>
                      <span className="font-bold text-zinc-900">+{installationCost} zł</span>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 text-[11px] flex justify-between items-center text-zinc-500">
                      <span>Metoda transportu:</span>
                      <span className="font-bold text-zinc-900">Dowóz przez ekipę montażową</span>
                    </div>

                    <div className="flex justify-between font-mono text-zinc-500 pb-1">
                      <span>Koszt transportu i dostawy:</span>
                      <span className="font-bold text-zinc-900">
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-sans text-[10px] font-bold uppercase tracking-wide">Darmowa dostawa (z montażem)</span>
                      </span>
                    </div>

                    {/* Applied discount display */}
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 text-[11px]">
                        <span className="font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Rabat 10% aktywowany
                        </span>
                        <strong className="font-mono">-{discountAmount} zł</strong>
                      </div>
                    )}

                  </div>

                  {/* Promo Code Input block */}
                  <div className="pt-3 border-t border-zinc-100 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 block">Dopasuj kod kuponu rabatowego</span>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Np. SMART10"
                        className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-widest font-mono text-zinc-800 placeholder:text-zinc-300 placeholder:font-sans focus:outline-none focus:border-zinc-500 flex-1"
                      />
                      <button 
                        type="button"
                        onClick={() => handleApplyPromo(promoCode)}
                        className="bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-bold uppercase tracking-wider px-4 rounded-xl transition-colors cursor-pointer"
                      >
                        Zastosuj
                      </button>
                    </div>
                    {promoError && <p className="text-[10px] text-red-500 font-bold font-mono">{promoError}</p>}
                    {promoSuccess && <p className="text-[10px] text-emerald-600 font-bold">{promoSuccess}</p>}
                  </div>

                  {/* Pricing Total block */}
                  <div className="pt-4 border-t border-dashed border-zinc-200 flex items-baseline justify-between font-black text-zinc-950">
                    <span className="text-sm">Razem brutto:</span>
                    <div className="text-right">
                      <span className="text-2xl font-mono">{finalTotalPrice} zł</span>
                      <p className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">Przesyłka wliczona</p>
                    </div>
                  </div>

                  <hr className="border-zinc-100" />

                  {/* CTA Checkout Toggle triggers checkout scroll or view */}
                  {checkoutStep !== "checkout" && (
                    <button
                      onClick={() => setCheckoutStep("checkout")}
                      className="w-full bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold py-3.5 rounded-2xl uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Dalej: Dane do montażu <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                </div>

                {/* Lead shipping and payment fields if activated */}
                {checkoutStep === "checkout" && (
                  <div id="order-form-container" className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-md space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                      <h3 className="text-xs font-black uppercase tracking-wider text-zinc-950">
                        Adres dostawy i montażu
                      </h3>
                      <button 
                        onClick={() => setCheckoutStep("config")} 
                        className="text-[10px] font-bold text-zinc-400 hover:text-zinc-800 uppercase"
                      >
                        Wróć do wyboru
                      </button>
                    </div>

                    <form onSubmit={handlePlaceOrder} className="space-y-3.5">
                      
                      {/* Name fields */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 block mb-1">Imię i nazwisko</label>
                        <input 
                          type="text" 
                          value={fullname}
                          onChange={(e) => setFullname(e.target.value)}
                          placeholder="Np. Jan Kowalski"
                          className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-zinc-650"
                        />
                        {formErrors.fullname && <span className="text-[10px] text-red-500 font-bold font-mono mt-0.5 block">{formErrors.fullname}</span>}
                      </div>

                      {/* Phone / Email grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 block mb-1">Adres E-mail</label>
                          <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="jan@domena.pl"
                            className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-zinc-650"
                          />
                          {formErrors.email && <span className="text-[10px] text-red-500 font-bold font-mono mt-0.5 block">{formErrors.email}</span>}
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 block mb-1">Numer telefonu</label>
                          <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="500 600 700"
                            className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-zinc-650"
                          />
                          {formErrors.phone && <span className="text-[10px] text-red-500 font-bold font-mono mt-0.5 block">{formErrors.phone}</span>}
                        </div>
                      </div>

                      {/* Shipping address fields */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 block mb-1">Ulica i numer lokalu</label>
                        <input 
                          type="text" 
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="Mickiewicza 12m. 4"
                          className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-zinc-650"
                        />
                        {formErrors.street && <span className="text-[10px] text-red-500 font-bold font-mono mt-0.5 block">{formErrors.street}</span>}
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 block mb-1">Kod pocztowy</label>
                          <input 
                            type="text" 
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)}
                            placeholder="00-000"
                            className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-2.5 text-xs font-bold text-center tracking-widest font-mono focus:outline-none focus:border-zinc-650"
                          />
                          {formErrors.postcode && <span className="text-[10px] text-red-500 font-bold font-mono mt-0.5 block">{formErrors.postcode}</span>}
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 block mb-1">Miasto</label>
                          <input 
                            type="text" 
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Warszawa"
                            className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-zinc-650"
                          />
                          {formErrors.city && <span className="text-[10px] text-red-500 font-bold font-mono mt-0.5 block">{formErrors.city}</span>}
                        </div>
                      </div>

                      {/* Payment Toggle methods */}
                      <div className="pt-2 border-t border-zinc-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 block mb-2">Metoda płatności kasy</span>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("blik")}
                            className={`py-2 px-1 rounded-xl text-[10px] font-extrabold uppercase border transition-all text-center cursor-pointer ${
                              paymentMethod === "blik" 
                                ? "bg-zinc-900 border-zinc-900 text-white shadow-3xs" 
                                : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-600"
                            }`}
                          >
                            BLIK
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("card")}
                            className={`py-2 px-1 rounded-xl text-[10px] font-extrabold uppercase border transition-all text-center cursor-pointer ${
                              paymentMethod === "card" 
                                ? "bg-zinc-900 border-zinc-900 text-white shadow-3xs" 
                                : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-600"
                            }`}
                          >
                            Karta
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("cash")}
                            className={`py-2 px-1 rounded-xl text-[10px] font-extrabold uppercase border transition-all text-center cursor-pointer ${
                              paymentMethod === "cash" 
                                ? "bg-zinc-900 border-zinc-900 text-white shadow-3xs" 
                                : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-600"
                            }`}
                          >
                            Pobranie
                          </button>
                        </div>
                      </div>

                      {/* Ultimate Checkout Submit Button */}
                      <button
                        type="submit"
                        className="w-full bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold py-4 rounded-2xl uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-4"
                      >
                        Potwierdzam zakup i płacę <Check className="w-4 h-4" />
                      </button>

                    </form>
                  </div>
                )}

                {/* Bullet safety signals */}
                <div className="bg-zinc-100/50 p-4 rounded-2xl border border-zinc-200/50 text-zinc-500 text-[11px] leading-relaxed flex gap-3">
                  <Shield className="w-5 h-5 text-zinc-405 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-800 uppercase text-[9px] tracking-wider block mb-1">Gwarancja Satysfakcji</strong>
                    30 dni na bezpłatny zwrot. Nic nie ryzykujesz — jeśli system nie spełni Twoich oczekiwań, odeślij go na nasz koszt, a otrzymasz 100% zwrotu pieniędzy.
                  </div>
                </div>

              </div>
              
            </div>
          </div>
        )}

      </section>

      {/* Testimonials Review module */}
      {checkoutStep === "config" && (
        <section id="opinie" className="py-16 bg-white border-t border-zinc-150/60 scroll-mt-10">
          <div className="max-w-6xl mx-auto px-6">
            
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-zinc-950 tracking-tight">Opinie Naszych Klientów</h2>
              <p className="text-zinc-500 text-xs md:text-sm mt-1">
                Dowiedz się dlaczego tysiące polskich klientów zaufało ekosystemowi Twój SMART Home.
              </p>
            </div>

            <div className="grid md:grid-cols-12 gap-8 items-start">
              
              {/* Left Column - Review lists (Grid 7) */}
              <div className="md:col-span-7 space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="p-5 rounded-2xl border border-zinc-150 shadow-3xs hover:border-zinc-250 transition-colors bg-zinc-50/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="font-extrabold text-xs text-zinc-900 block">{r.author}</span>
                        <div className="flex font-mono text-[10px] text-zinc-400 mt-1 items-center gap-1">
                          
                          {/* Verified Badge */}
                          {r.verified && (
                            <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5 mr-1 font-sans">
                              ✓ Zweryfikowany zakup
                            </span>
                          )}
                          <span>Opublikowano: {r.date}</span>
                        </div>
                      </div>

                      {/* Display star ratings */}
                      <div className="flex text-amber-500">
                        {Array.from({ length: r.rating }).map((_, idx) => (
                          <Star key={idx} className="w-3 md:w-3.5 h-3 md:h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed font-sans">{r.content}</p>
                  </div>
                ))}
              </div>

              {/* Right Column - User add opinion form (Grid 5) */}
              <div className="md:col-span-5 bg-zinc-50 border border-zinc-150 p-6 rounded-3xl shadow-3xs">
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-950 mb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-zinc-950" /> Dodaj swoją opinię
                </h3>
                
                <p className="text-[11px] text-zinc-500 mb-4 leading-relaxed">
                  Podziel się ze społecznością swoimi wrażeniami z korzystania z produktów Twój SMART Home.
                </p>

                {reviewSuccessMsg && (
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-3 rounded-xl text-xs font-bold mb-4">
                    {reviewSuccessMsg}
                  </div>
                )}

                <form onSubmit={handleAddReview} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 block mb-1">Twoje Imię / Inicjały</label>
                    <input 
                      type="text" 
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      placeholder="Np. Rafał S."
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-zinc-650"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 block mb-1">Ocena produktu</label>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold font-mono focus:outline-none focus:border-zinc-650"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ Super (5/5)</option>
                      <option value="4">⭐⭐⭐⭐ Bardzo dobry (4/5)</option>
                      <option value="3">⭐⭐⭐ Przeciętny (3/5)</option>
                      <option value="2">⭐⭐ Słaby (2/5)</option>
                      <option value="1">⭐ Bardzo słaby (1/5)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 block mb-1">Twoja opinia</label>
                    <textarea
                      value={newReviewContent}
                      onChange={(e) => setNewReviewContent(e.target.value)}
                      rows={3}
                      placeholder="Napisz kilka słów o montażu, działaniu, aplikacji..."
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-zinc-650 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold py-3 rounded-xl uppercase tracking-wider transition-all shadow-3xs cursor-pointer"
                  >
                    Wyślij opinię
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Contact Form & Corporate Info (replacing FAQ) */}
      {checkoutStep === "config" && (
        <section id="kontakt" className="py-16 border-t border-zinc-150 max-w-6xl mx-auto px-6 scroll-mt-10">
          <div className="grid md:grid-cols-12 gap-12 items-start">
            
            {/* Left side: Dane teleadresowe & Co */}
            <div className="md:col-span-5 space-y-6">
              <div>
                <span className="text-[10px] bg-zinc-100 text-zinc-800 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-zinc-200">
                  DANE TELEADRESOWE
                </span>
                <h2 className="text-2xl font-black text-zinc-950 tracking-tight mt-3">Dream Studio</h2>
                <p className="text-zinc-550 text-xs mt-1.5 leading-relaxed">
                  Masz pytania dotyczące systemu Twój SMART Home? Chcesz dowiedzieć się więcej o ofercie? Jesteśmy tu, aby pomóc Ci stworzyć Twój wymarzony, w pełni bezprzewodowy dom. Skontaktuj się z nami!
                </p>
              </div>

              <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 shrink-0">
                    <MapPin className="w-4 h-4 text-zinc-950" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Adres korespondencyjny</h4>
                    <p className="text-zinc-900 text-xs font-bold mt-0.5">Dream Studio</p>
                    <p className="text-zinc-605 text-xs">ul. Wesoła 25, 34-322 Rychwałd</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 shrink-0">
                    <Mail className="w-4 h-4 text-zinc-950" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">E-mail</h4>
                    <a href="mailto:DreamStudiopl@gmail.com" className="text-zinc-950 text-xs font-bold mt-0.5 hover:underline block">
                      DreamStudiopl@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 shrink-0">
                    <Lock className="w-4 h-4 text-zinc-950" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">NIP</h4>
                    <p className="text-zinc-900 text-xs font-mono font-bold mt-0.5">627-264-32-87</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Contact Form */}
            <div className="md:col-span-7 bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-black text-zinc-950 tracking-tight flex items-center gap-2">
                Napisz do nas <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              </h3>
              <p className="text-zinc-500 text-xs mt-1 mb-6">
                Skorzystaj z poniższego formularza, aby wysłać do nas zapytanie.
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-zinc-450 block mb-1">Twoje Imię i Nazwisko *</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="np. Jan Kowalski"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-zinc-950 focus:bg-white transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-zinc-450 block mb-1">Twój adres E-mail *</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="np. jan@example.com"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-zinc-950 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-450 block mb-1">Numer Telefonu (Opcjonalnie)</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="np. +48 123 456 789"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-zinc-950 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-450 block mb-1">Twoja wiadomość *</label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={4}
                    placeholder="Wpisz treść swojej wiadomości..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-zinc-950 focus:bg-white transition-all resize-none"
                    required
                  />
                </div>

                {contactSuccessMsg && (
                  <div className={`p-4 rounded-xl text-xs font-bold ${
                    contactSuccessMsg.includes("błąd") 
                      ? "bg-red-50 text-red-700 border border-red-150" 
                      : "bg-emerald-50 text-emerald-800 border border-emerald-150"
                  }`}>
                    {contactSuccessMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingContact}
                  className="w-full bg-zinc-950 hover:bg-zinc-850 disabled:bg-zinc-300 text-white text-xs font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all shadow-3xs cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmittingContact ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Wysyłanie...
                    </>
                  ) : (
                    "Wyślij wiadomość"
                  )}
                </button>
              </form>
            </div>

          </div>
        </section>
      )}

      {/* Footer layout */}
      <footer className="bg-zinc-50 border-t border-zinc-150 py-12 text-zinc-500 text-xs">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 items-start text-left">
          
          {/* Logo & copyright */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-zinc-950 tracking-tighter uppercase">Twój SMART Home</span>
              <span className="text-[10px] text-zinc-300">|</span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Original IoT kit</span>
            </div>
            <p className="text-zinc-450 leading-relaxed">
              © 2026 Twój SMART Home. Wszystkie prawa zastrzeżone. Bezpieczne i inteligentne systemy dla każdego domu.
            </p>
          </div>

          {/* Contact Details requested */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase text-zinc-900 tracking-wider">Dream Studio</h4>
            <p className="text-zinc-600 leading-relaxed">
              ul. Wesoła 25, 34-322 Rychwałd<br />
              NIP: <span className="font-mono">627-264-32-87</span>
            </p>
            <p className="text-zinc-600">
              E-mail: <a href="mailto:DreamStudiopl@gmail.com" className="text-zinc-950 font-bold hover:underline">DreamStudiopl@gmail.com</a>
            </p>
          </div>

          {/* Link info */}
          <div className="md:text-right space-y-3 md:self-stretch flex flex-col justify-between">
            <div className="flex md:justify-end gap-4 text-zinc-450 font-bold uppercase tracking-wider text-[10px]">
              <a href="#kontakt" className="hover:text-zinc-900 transition-colors">Regulamin</a>
              <span>•</span>
              <a href="#kontakt" className="hover:text-zinc-900 transition-colors">Polityka Prywatności</a>
            </div>
            <p className="text-[10px] text-zinc-400">
              Dysonowanie i dystrybucja techniczna realizowana przez Dream Studio.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
