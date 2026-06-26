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
  Wrench,
  Wifi,
  X,
  Trash2,
  Edit,
  Filter,
  Download,
  Search,
  ShieldCheck,
  LogOut,
  Database,
  TrendingUp,
  Briefcase,
  FileText
} from "lucide-react";
import {
  SmartHomeHeaderLogo,
  SmartHomeFullLogo,
  SmartHomeEmblem
} from "./components/SmartHomeLogo";
import CrmDashboard from "./components/CrmDashboard";

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
    content: "Mój najlepszy zakup do nowego domu. Montaż zajął im dosłownie 2h, a system działa niezawodnie. Zamówiłem 2 kamery i klamkę smart, a czujnik zalania otrzymałem gratis. Dzięki! Szybko i sprawnie, POLECAM!",
    verified: true
  },
  {
    id: 2,
    author: "Karolina W.",
    rating: 5,
    date: "3 dni temu",
    content: "Szukałam niedrogiego systemu do monitorowania domu i obserwacji psów podczas nieobecności w mieszkaniu. Ekipa przyjechała, zainstalowała 3 obrotowe kamery, zainstalowany i skonfigurowali nowy router wifi, i zainstalowali przełącznik światła na wifi. Jestem zadowolona i mogę polecić.",
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

export interface CRMOrder {
  id: string;
  date: string;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  itemsOrdered: Array<{ name: string; qty: number; price: number }>;
  finalTotalPrice: number;
  status: "new" | "in_progress" | "completed" | "cancelled";
  notes?: string;
}

export interface CRMInquiry {
  id: string;
  date: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "new" | "in_progress" | "completed" | "cancelled";
  notes?: string;
}

const SEED_CRM_ORDERS: CRMOrder[] = [
  {
    id: "SMART-748291",
    date: "24.06.2026",
    fullname: "Janusz Kowalski (Kowalski Sp. z o.o.)",
    email: "j.kowalski@kowalski-transport.pl",
    phone: "602 123 456",
    address: "ul. Przemysłowa 12, 43-300 Bielsko-Biała",
    itemsOrdered: [
      { name: "Montaż Twój SMART Home", qty: 6, price: 1194 },
      { name: "Kamera Bezprzewodowa SMART Home Cam (Dual)", qty: 4, price: 796 },
      { name: "Zamek Smart Lock Twój SMART Home Lock", qty: 2, price: 798 },
      { name: "Czujnik Zalania / Dymu Twój SMART Home", qty: 2, price: 258 },
      { name: "Aktualizacja WiFi do DualBand WiFi 7 + Konfiguracja", qty: 1, price: 449 },
      { name: "Profesjonalny montaż i konfiguracja (15 urządzeń)", qty: 1, price: 490 }
    ],
    finalTotalPrice: 3985,
    status: "in_progress",
    notes: "Firma transportowa. Zabezpieczenie placu przeładunkowego i głównego biura. Wymagana faktura VAT. Montaż umówiony na najbliższy wtorek o 9:00."
  },
  {
    id: "SMART-938210",
    date: "25.06.2026",
    fullname: "Mariusz Nowak (Nowak Budownictwo)",
    email: "m.nowak@nowak-budownictwo.pl",
    phone: "512 888 999",
    address: "ul. Widokowa 5, 34-300 Żywiec",
    itemsOrdered: [
      { name: "Montaż Twój SMART Home", qty: 4, price: 796 },
      { name: "Kamera Bezprzewodowa SMART Home Cam (Singiel)", qty: 4, price: 596 },
      { name: "System Alarmowy Twój SMART Home Alarm (Wersja Zaawansowana)", qty: 1, price: 899 },
      { name: "Profesjonalny montaż i konfiguracja (9 urządzeń)", qty: 1, price: 390 }
    ],
    finalTotalPrice: 2681,
    status: "new",
    notes: "Dla nowego placu budowy domów jednorodzinnych w Żywcu. Szybki montaż kamer bezprzewodowych na słupach tymczasowych. Sprawdzić zasięg LTE."
  },
  {
    id: "SMART-103942",
    date: "20.06.2026",
    fullname: "Anna Zielińska",
    email: "anna.zielinska@interia.pl",
    phone: "792 555 444",
    address: "Al. Pokoju 14, 31-564 Kraków",
    itemsOrdered: [
      { name: "Montaż Twój SMART Home", qty: 2, price: 398 },
      { name: "Kamera Bezprzewodowa SMART Home Cam (Singiel)", qty: 2, price: 298 },
      { name: "Zamek Smart Lock Twój SMART Home Lock", qty: 1, price: 399 },
      { name: "Profesjonalny montaż i konfiguracja (5 urządzeń)", qty: 1, price: 190 }
    ],
    finalTotalPrice: 1285,
    status: "completed",
    notes: "Montaż wykonany bez problemów. Klientka zachwycona funkcją otwierania drzwi smartfonem oraz kodami dostępu dla ekipy remontowej. Opłacone gotówką."
  }
];

const SEED_CRM_INQUIRIES: CRMInquiry[] = [
  {
    id: "INQ-481920",
    date: "26.06.2026",
    name: "Tomasz Mazur (Mazur Logistics Sp. z o.o.)",
    email: "t.mazur@mazur-logistics.pl",
    phone: "501 234 567",
    message: "Dzień dobry, poszukujemy profesjonalnego rozwiązania do monitorowania nowo powstającego centrum logistycznego w Katowicach (hala 4000m2 + parking zewnętrzny). Interesuje nas monitoring kamer IP z detekcją AI oraz system alarmowy połączony z kontrolą dostępu na klamki Smart. Proszę o kontakt w celu umówienia darmowego audytu na miejscu.",
    status: "new",
    notes: "Potencjalnie bardzo duży klient korporacyjny. Zadzwonić pilnie w poniedziałek rano i zaproponować spotkanie z darmowym audytem mienia."
  },
  {
    id: "INQ-294012",
    date: "23.06.2026",
    name: "Katarzyna Wiśniewska",
    email: "k.wisniewska@gmail.com",
    phone: "602 987 654",
    message: "Chciałabym zabezpieczyć swój dom jednorodzinny w Żywcu. Zależy mi na 3 kamerach zewnętrznych oraz czujnikach zalania/dymu w kotłowni i kuchni. Czy montaż jest całkowicie bezinwazyjny? Ile czasu trwa instalacja i czy nauczą mnie Państwo obsługi aplikacji na telefonie?",
    status: "in_progress",
    notes: "Rozmawiałem telefonicznie. Klientka obawia się wiercenia. Przekonana o bezprzewodowości i darmowej aplikacji. Montaż zaplanowany wstępnie na czwartek za tydzień."
  },
  {
    id: "INQ-182930",
    date: "18.06.2026",
    name: "Piotr Woźniak (Woźniak Developer)",
    email: "biuro@wozniak-developer.pl",
    phone: "733 445 556",
    message: "Szukam firmy do stałej współpracy przy zabezpieczaniu placów budowy na terenie Małopolski i Śląska. Obecnie startujemy z 3 nowymi osiedlami w Krakowie i Bielsku. Potrzebujemy stabilnego monitoringu kamer LTE na zasilaniu solarnym. Proszę o przesłanie cennika B2B.",
    status: "completed",
    notes: "Nawiązano stałą współpracę. Pierwsze osiedle już monitorowane i zabezpieczone (kamery obrotowe + alarm dymu). Płatności na czas, super kontakt."
  }
];

export default function App() {
  const [lang, setLang] = useState<"PL" | "ENG" | "CZ">("PL");

  const t = (pl: string, eng: string, cz: string) => {
    if (lang === "ENG") return eng;
    if (lang === "CZ") return cz;
    return pl;
  };

  // Configurator state variables
  const [camsSingle, setCamsSingle] = useState(1);
  const [camsDual, setCamsDual] = useState(0);
  const [wifiUpgrade, setWifiUpgrade] = useState<"none" | "wifi6" | "wifi7">("none");
  const [locks, setLocks] = useState(1);
  const [floods, setFloods] = useState(1);
  const [alarmType, setAlarmType] = useState<"none" | "basic" | "advanced">("basic");

  // Promo Code State
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // overall percentage discount e.g. 10 for 10%
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  // Booking Flow Steps
  // 'config' | 'checkout' | 'success'
  const [checkoutStep, setCheckoutStep] = useState<"config" | "checkout" | "success">("config");
  const [currentPath, setCurrentPath] = useState(() => {
    if (
      window.location.pathname === "/crm" ||
      window.location.search.includes("crm") ||
      window.location.hash.includes("crm") ||
      window.location.search.includes("admin") ||
      window.location.hash.includes("admin")
    ) {
      return "/crm";
    }
    return window.location.pathname;
  });
  
  // CRM state & local storage integration
  const [crmOrders, setCrmOrders] = useState<CRMOrder[]>([]);
  const [crmInquiries, setCrmInquiries] = useState<CRMInquiry[]>([]);
  const [isCrmAuthenticated, setIsCrmAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("crm_authenticated") === "true";
  });

  // Load CRM data from localStorage or seed
  useEffect(() => {
    const localOrders = localStorage.getItem("crm_orders");
    if (localOrders) {
      setCrmOrders(JSON.parse(localOrders));
    } else {
      localStorage.setItem("crm_orders", JSON.stringify(SEED_CRM_ORDERS));
      setCrmOrders(SEED_CRM_ORDERS);
    }

    const localInquiries = localStorage.getItem("crm_inquiries");
    if (localInquiries) {
      setCrmInquiries(JSON.parse(localInquiries));
    } else {
      localStorage.setItem("crm_inquiries", JSON.stringify(SEED_CRM_INQUIRIES));
      setCrmInquiries(SEED_CRM_INQUIRIES);
    }
  }, []);

  // Update CRM lists in localStorage
  const updateCrmOrders = (newOrders: CRMOrder[]) => {
    setCrmOrders(newOrders);
    localStorage.setItem("crm_orders", JSON.stringify(newOrders));
  };

  const updateCrmInquiries = (newInquiries: CRMInquiry[]) => {
    setCrmInquiries(newInquiries);
    localStorage.setItem("crm_inquiries", JSON.stringify(newInquiries));
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState(null, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Call Widget State
  const [isCallWidgetOpen, setIsCallWidgetOpen] = useState(false);
  const [hasUserClosedCallWidget, setHasUserClosedCallWidget] = useState(false);

  useEffect(() => {
    // Automatically show the popup after 4 seconds to capture leads, unless user closed it
    const timer = setTimeout(() => {
      if (!hasUserClosedCallWidget) {
        setIsCallWidgetOpen(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [hasUserClosedCallWidget]);

  // Lead Checkout Form State
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const deliveryMethod = "expert";
  const [paymentMethod, setPaymentMethod] = useState<"blik" | "card" | "cash">("blik");
  const [consentAccepted, setConsentAccepted] = useState(false);
  
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

  // Legal policy modal state
  const [activeLegalModal, setActiveLegalModal] = useState<"regulamin" | "polityka" | null>(null);

  // Professional installation is standard and mandatory
  const includeInstallation = false;

  // Mock receipt/invoice data generated on successful order
  const [orderSummary, setOrderSummary] = useState<any>(null);

  // Base pricing declarations
  const HUB_PRICE = 59;
  const CAM_SINGLE_UNIT_PRICE = 250;
  const CAM_DUAL_UNIT_PRICE = 490;
  const LOCK_UNIT_PRICE = 590;
  const FLOOD_UNIT_PRICE = 129;
  const ALARM_BASIC_PRICE = 490;
  const ALARM_ADVANCED_PRICE = 1200;
  const WIFI_6_PRICE = 360;
  const WIFI_7_PRICE = 599;

  // Real-time pricing calculations
  const camerasPrice = (camsSingle * CAM_SINGLE_UNIT_PRICE) + (camsDual * CAM_DUAL_UNIT_PRICE);
  const locksPrice = locks * LOCK_UNIT_PRICE;
  const floodsPrice = floods * FLOOD_UNIT_PRICE;
  const alarmPrice = alarmType === "basic" ? ALARM_BASIC_PRICE : alarmType === "advanced" ? ALARM_ADVANCED_PRICE : 0;
  const wifiUpgradePrice = wifiUpgrade === "wifi6" ? WIFI_6_PRICE : wifiUpgrade === "wifi7" ? WIFI_7_PRICE : 0;

  const selectedDevicesCount = camsSingle + camsDual + locks + floods + (alarmType !== "none" ? 1 : 0);
  const montazPrice = selectedDevicesCount * HUB_PRICE;

  const subtotalItemsOnly = montazPrice + camerasPrice + locksPrice + floodsPrice + alarmPrice + wifiUpgradePrice;
  const totalItemCount = selectedDevicesCount + (wifiUpgrade !== "none" ? 1 : 0);

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
      setPromoSuccess(t("Kod rabatowy SMART10 został pomyślnie aktywowany! Przyznano 10% zniżki.", "Promo code SMART10 has been successfully activated! 10% discount granted.", "Slevový kód SMART10 byl úspěšně aktivován! Byla poskytnuta sleva 10 %."));
      setPromoError("");
    } else if (trimmed === "") {
      setPromoError(t("Wprowadź kod przed zatwierdzeniem.", "Enter a code before applying.", "Před použitím zadejte kód."));
      setPromoSuccess("");
    } else {
      setPromoError(t("Wprowadzony kod jest niepoprawny lub wygasł.", "The code entered is invalid or has expired.", "Zadaný kód je neplatný nebo vypršel."));
      setPromoSuccess("");
    }
  };

  // Checkout submission handler
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!fullname.trim()) errors.fullname = t("Wpisz imię i nazwisko", "Enter your full name", "Zadejte své jméno a příjmení");
    if (!email.trim() || !email.includes("@")) errors.email = t("Wpisz poprawny adres e-mail", "Enter a valid email address", "Zadejte platnou e-mailovou adresu");
    if (!phone.trim() || phone.length < 9) errors.phone = t("Wpisz poprawny numer telefonu (min. 9 cyfr)", "Enter a valid phone number (min. 9 digits)", "Zadejte platné telefonní číslo (min. 9 číslic)");
    if (!street.trim()) errors.street = t("Ulica i numer budynku są wymagane", "Street and building number are required", "Ulice a číslo domu jsou povinné");
    if (!postcode.trim() || !/^\d{2}-\d{3}$/.test(postcode)) errors.postcode = t("Wpisz kod pocztowy w formacie 00-000", "Enter postal code in format 00-000", "Zadejte PSČ ve formátu 00-000");
    if (!city.trim()) errors.city = t("Wpisz miasto", "Enter city", "Zadejte město");
    if (!consentAccepted) errors.consent = t("Musisz zaakceptować regulamin i politykę prywatności", "You must accept the terms and privacy policy", "Musíte souhlasit s obchodními podmínkami a zásadami ochrany osobních údajů");

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // scroll to bottom to see form errors nicely
      const formEl = document.getElementById("order-form-container");
      formEl?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setFormErrors({});
    setIsSubmittingOrder(true);

    const randomOrderId = "SMART-" + Math.floor(100000 + Math.random() * 900000);
    const estDeliveryDate = new Date();
    estDeliveryDate.setDate(estDeliveryDate.getDate() + 3); // 3 days for scheduling and installation

    const itemsOrdered = [
      { name: "Montaż Twój SMART Home", qty: selectedDevicesCount, price: montazPrice },
      ...(camsSingle > 0 ? [{ name: "Kamera Bezprzewodowa SMART Home Cam (Singiel)", qty: camsSingle, price: camsSingle * CAM_SINGLE_UNIT_PRICE }] : []),
      ...(camsDual > 0 ? [{ name: "Kamera Bezprzewodowa SMART Home Cam (Dual)", qty: camsDual, price: camsDual * CAM_DUAL_UNIT_PRICE }] : []),
      ...(wifiUpgrade === "wifi6" ? [{ name: "Aktualizacja WiFi do DualBand WiFi 6 + Konfiguracja", qty: 1, price: WIFI_6_PRICE }] : []),
      ...(wifiUpgrade === "wifi7" ? [{ name: "Aktualizacja WiFi do DualBand WiFi 7 + Konfiguracja", qty: 1, price: WIFI_7_PRICE }] : []),
      ...(locks > 0 ? [{ name: "Zamek Smart Lock Twój SMART Home Lock", qty: locks, price: locksPrice }] : []),
      ...(floods > 0 ? [{ name: "Czujnik Zalania / Dymu Twój SMART Home", qty: floods, price: floodsPrice }] : []),
      ...(alarmType === "basic" ? [{ name: "System Alarmowy Twój SMART Home Alarm (Wersja Podstawowa)", qty: 1, price: ALARM_BASIC_PRICE }] : []),
      ...(alarmType === "advanced" ? [{ name: "System Alarmowy Twój SMART Home Alarm (Wersja Zaawansowana)", qty: 1, price: ALARM_ADVANCED_PRICE }] : []),
      ...(includeInstallation ? [{ name: `Profesjonalny montaż i konfiguracja (${totalItemCount} urządzeń)`, qty: 1, price: installationCost }] : [])
    ];

    const itemsDescription = itemsOrdered.map(item => `• ${item.name} (x${item.qty}) - ${item.price} zł`).join("\n");
    const totalWithDiscount = finalTotalPrice;

    try {
      await fetch("https://formsubmit.co/ajax/dreamstudiopl@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `Nowa konfiguracja i prośba o wycenę: ${fullname} (${randomOrderId})`,
          "Imię i nazwisko": fullname,
          "E-mail": email,
          "Telefon": phone,
          "Adres": `${street}, ${postcode} ${city}`,
          "Wybrane elementy zestawu": itemsDescription,
          "Suma szacunkowa": `${totalWithDiscount} zł`,
          "Rabat": appliedDiscount > 0 ? `${appliedDiscount}%` : "Brak",
          "Wycena na miejscu": "Tak, darmowa wycena i konsultacja",
          message: `Klient przesłał konfigurację smart home i prosi o kontakt w celu bezpłatnej wyceny oraz uzgodnienia terminu montażu.`
        })
      });
    } catch (err) {
      console.error("FormSubmit send failed:", err);
    }

    setOrderSummary({
      id: randomOrderId,
      date: new Date().toLocaleDateString("pl-PL"),
      fullname,
      email,
      phone,
      address: `${street}, ${postcode} ${city}`,
      deliveryMethodName: "Bezpłatny transport i wniesienie z montażem",
      paymentMethodName: "Bezpłatna wycena i audyt u klienta",
      itemsOrdered,
      deliveryCost,
      subtotal: subtotalItemsOnly + installationCost,
      discountAmount,
      finalTotalPrice,
      deliveryDate: estDeliveryDate.toLocaleDateString("pl-PL")
    });

    const newCRMOrder: CRMOrder = {
      id: randomOrderId,
      date: new Date().toLocaleDateString("pl-PL"),
      fullname,
      email,
      phone,
      address: `${street}, ${postcode} ${city}`,
      itemsOrdered,
      finalTotalPrice,
      status: "new",
      notes: "Złożone automatycznie przez formularz konfiguratora."
    };
    updateCrmOrders([newCRMOrder, ...crmOrders]);

    setIsSubmittingOrder(false);
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
      const response = await fetch("https://formsubmit.co/ajax/dreamstudiopl@gmail.com", {
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
        const newInquiry: CRMInquiry = {
          id: "INQ-" + Math.floor(100000 + Math.random() * 900000),
          date: new Date().toLocaleDateString("pl-PL"),
          name: contactName,
          email: contactEmail,
          phone: contactPhone || undefined,
          message: contactMessage,
          status: "new",
          notes: "Wysłane przez formularz kontaktowy na stronie."
        };
        updateCrmInquiries([newInquiry, ...crmInquiries]);

        setContactSuccessMsg("Dziękujemy! Twoja wiadomość została pomyślnie wysłana bezpośrednio na adres dreamstudiopl@gmail.com. Skontaktujemy się z Tobą wkrótce!");
        setContactName("");
        setContactEmail("");
        setContactPhone("");
        setContactMessage("");
        navigateTo("/kontaktwyslany");
      } else {
        throw new Error("Wysłanie nie powiodło się");
      }
    } catch (error) {
      // Fallback: system email alert or alternative presentation
      setContactSuccessMsg("Wystąpił błąd podczas wysyłania przez formularz. Możesz napisać do nas bezpośrednio na: dreamstudiopl@gmail.com");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleReset = () => {
    setCamsSingle(1);
    setCamsDual(0);
    setLocks(1);
    setFloods(1);
    setAlarmType("basic");
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

  if (currentPath === "/crm") {
    return (
      <CrmDashboard
        crmOrders={crmOrders}
        crmInquiries={crmInquiries}
        updateCrmOrders={updateCrmOrders}
        updateCrmInquiries={updateCrmInquiries}
        onBackToHome={() => navigateTo("/")}
      />
    );
  }

  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
      
      {/* Top Banner Offer */}
      {showPromoBadge && (
        <div className="bg-zinc-950 text-white text-[11px] font-bold tracking-wider py-2 uppercase px-4 text-center relative flex justify-center items-center">
          <span>{t("🎁 Wyjątkowa oferta: Profesjonalny montaż i bezpłatny transport + 10% rabatu z kodem", "🎁 Special Offer: Professional installation & free shipping + 10% discount with code", "🎁 Výjimečná nabídka: Profesionální montáž a doprava zdarma + 10% sleva s kódem")} <strong className="bg-white/10 px-2 py-0.5 rounded font-mono border border-white/20">SMART10</strong></span>
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
          <div className="flex items-center gap-3">
            <SmartHomeHeaderLogo onClick={() => { setCheckoutStep("config"); navigateTo("/"); }} />
            <span className="text-[9px] bg-zinc-100 text-zinc-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans border border-zinc-200 hidden sm:inline-block">
              ORIGINAL KIT
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-zinc-650 uppercase tracking-wider">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setCheckoutStep("config");
                if (currentPath !== "/") {
                  navigateTo("/");
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="hover:text-zinc-950 transition-colors"
            >
              {t("Home", "Home", "Domů")}
            </a>
            <a 
              href="#cechy" 
              onClick={(e) => {
                if (currentPath !== "/") {
                  e.preventDefault();
                  navigateTo("/");
                  setTimeout(() => {
                    const el = document.getElementById("cechy");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              }}
              className="hover:text-zinc-950 transition-colors"
            >
              {t("Zalety", "Advantages", "Výhody")}
            </a>
            <a 
              href="#konfigurator" 
              onClick={(e) => {
                if (currentPath !== "/") {
                  e.preventDefault();
                  navigateTo("/");
                  setTimeout(() => {
                    const el = document.getElementById("konfigurator");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              }}
              className="hover:text-zinc-950 transition-colors"
            >
              {t("Kreator zestawu", "Kit Creator", "Konfigurátor")}
            </a>
            <a 
              href="#opinie" 
              onClick={(e) => {
                if (currentPath !== "/") {
                  e.preventDefault();
                  navigateTo("/");
                  setTimeout(() => {
                    const el = document.getElementById("opinie");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              }}
              className="hover:text-zinc-950 transition-colors"
            >
              {t("Referencje", "Reviews", "Reference")}
            </a>
            <a 
              href="#kontakt" 
              onClick={(e) => {
                if (currentPath !== "/") {
                  e.preventDefault();
                  navigateTo("/");
                  setTimeout(() => {
                    const el = document.getElementById("kontakt");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              }}
              className="hover:text-zinc-950 transition-colors"
            >
              {t("Kontakt", "Contact", "Kontakt")}
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex bg-zinc-100 p-0.5 rounded-xl border border-zinc-200">
              {(["PL", "ENG", "CZ"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                    lang === l
                      ? "bg-zinc-950 text-white shadow-3xs"
                      : "text-zinc-500 hover:text-zinc-950"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <a 
              href="#konfigurator" 
              onClick={(e) => {
                if (currentPath !== "/") {
                  e.preventDefault();
                  navigateTo("/");
                  setTimeout(() => {
                    const el = document.getElementById("konfigurator");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              }}
              className="bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold py-2.5 px-5 rounded-xl uppercase tracking-wider transition-all shadow-3xs cursor-pointer flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> {t("Skonfiguruj", "Configure", "Konfigurovat")}
            </a>
          </div>
        </div>
      </header>

      {/* Infinite Scrolling Marquee Bar */}
      <div className="bg-zinc-950 border-b border-zinc-900 text-zinc-100 py-3 overflow-hidden relative select-none">
        <div className="flex w-max animate-marquee text-[11px] md:text-xs font-semibold tracking-wider uppercase font-sans">
          <span className="px-6 flex items-center gap-2">
            ✨ {t("Potrzebujesz Kamer do Domu lub Firmy? SMART Klamki do obiektu, Czujnika zalania, Czujnika Temperatury i Wilgotności, Systemu Alarmowego? Zmiany WiFi na szybsze z konfiguracją i Montażem.", "Need Cameras for Home or Business? SMART Locks, Flood sensor, Temperature and Humidity Sensor, Alarm System? Faster WiFi with configuration & installation.", "Potřebujete kamery pro dům nebo firmu? SMART zámky, záplavový senzor, senzor teploty a vlhkosti, alarm? Rychlejší WiFi s konfigurací a instalací.")} <strong className="text-amber-400">{t("JESTEŚ W DOBRYM MIEJSCU!", "YOU ARE IN THE RIGHT PLACE!", "JSTE NA SPRÁVNÉM MÍSTĚ!")}</strong>
          </span>
          <span className="px-6 flex items-center gap-2">
            ✨ {t("Potrzebujesz Kamer do Domu lub Firmy? SMART Klamki do obiektu, Czujnika zalania, Czujnika Temperatury i Wilgotności, Systemu Alarmowego? Zmiany WiFi na szybsze z konfiguracją i Montażem.", "Need Cameras for Home or Business? SMART Locks, Flood sensor, Temperature and Humidity Sensor, Alarm System? Faster WiFi with configuration & installation.", "Potřebujete kamery pro dům nebo firmu? SMART zámky, záplavový senzor, senzor teploty a vlhkosti, alarm? Rychlejší WiFi s konfigurací a instalací.")} <strong className="text-amber-400">{t("JESTEŚ W DOBRYM MIEJSCU!", "YOU ARE IN THE RIGHT PLACE!", "JSTE NA SPRÁVNÉM MÍSTĚ!")}</strong>
          </span>
          <span className="px-6 flex items-center gap-2">
            ✨ {t("Potrzebujesz Kamer do Domu lub Firmy? SMART Klamki do obiektu, Czujnika zalania, Czujnika Temperatury i Wilgotności, Systemu Alarmowego? Zmiany WiFi na szybsze z konfiguracją i Montażem.", "Need Cameras for Home or Business? SMART Locks, Flood sensor, Temperature and Humidity Sensor, Alarm System? Faster WiFi with configuration & installation.", "Potřebujete kamery pro dům nebo firmu? SMART zámky, záplavový senzor, senzor teploty a vlhkosti, alarm? Rychlejší WiFi s konfigurací a instalací.")} <strong className="text-amber-400">{t("JESTEŚ W DOBRYM MIEJSCU!", "YOU ARE IN THE RIGHT PLACE!", "JSTE NA SPRÁVNÉM MÍSTĚ!")}</strong>
          </span>
        </div>
      </div>


      {/* Hero section */}
      {currentPath === "/kontaktwyslany" ? (
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-zinc-200 via-zinc-950 to-zinc-200" />
            
            <div className="mx-auto w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-6 border border-zinc-200">
              <Check className="w-8 h-8 text-zinc-900" />
            </div>

            <span className="text-[10px] bg-zinc-100 text-zinc-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-zinc-200">
              ZGŁOSZENIE WYŚLANE POMYŚLNIE
            </span>

            <h1 className="text-3xl md:text-4xl font-black text-zinc-950 tracking-tight mt-6">
              Dziękujemy za kontakt!
            </h1>

            <p className="text-sm md:text-base text-zinc-500 leading-relaxed max-w-lg mx-auto mt-4">
              Twoja wiadomość została pomyślnie wysłana i trafiła bezpośrednio do naszego zespołu technicznego na adres <strong className="text-zinc-900 font-semibold">dreamstudiopl@gmail.com</strong>.
            </p>

            <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-6 my-8 text-left space-y-4 max-w-xl mx-auto">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Co wydarzy się teraz?</h3>
              <div className="grid gap-3 text-xs text-zinc-655">
                <div className="flex gap-3">
                  <span className="font-mono font-bold text-zinc-900 bg-zinc-200 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-center text-[10px] leading-5">1</span>
                  <p><strong>Analiza zgłoszenia:</strong> Zapoznamy się z Twoimi pytaniami lub konfiguracją w ciągu maksymalnie 2 godzin.</p>
                </div>
                <div className="flex gap-3">
                  <span className="font-mono font-bold text-zinc-900 bg-zinc-200 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-center text-[10px] leading-5">2</span>
                  <p><strong>Kontakt zwrotny:</strong> Oddzwonimy lub odpiszemy z gotowymi odpowiedziami oraz darmową wyceną.</p>
                </div>
                <div className="flex gap-3">
                  <span className="font-mono font-bold text-zinc-900 bg-zinc-200 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-center text-[10px] leading-5">3</span>
                  <p><strong>Propozycja terminu:</strong> Zaproponujemy dogodny termin bezpłatnej wizyty doradczej lub bezpośredniego montażu.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button 
                onClick={() => navigateTo("/")}
                className="bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold py-3.5 px-8 rounded-xl uppercase tracking-wider transition-all shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
              >
                Wróć do strony głównej
              </button>
              <button 
                onClick={() => {
                  navigateTo("/");
                  setTimeout(() => {
                    const element = document.getElementById("konfigurator");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }, 150);
                }}
                className="bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-250 text-xs font-bold py-3.5 px-8 rounded-xl uppercase tracking-wider transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                Przejdź do konfiguratora
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {checkoutStep === "config" && (
        <section className="py-12 md:py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          {/* Left Text Detail */}
          <div className="md:col-span-6 space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 leading-[1.1]">
              {t("Twój dom. Mądrzejszy, Bezpieczniejszy i Funkcjonalny!", "Your home. Smarter, Safer, and Functional!", "Váš domov. Chytřejší, bezpečnější a funkčnější!")}
            </h1>
            
            <p className="text-sm md:text-base text-zinc-500 leading-relaxed max-w-lg">
              {lang === "PL" && (
                <>System <strong>Twój SMART Home</strong> to rewolucja w domowej automatyzacji. Całkowicie bezprzewodowe elementy instalowane bezpośrednio przez naszą firmę. Bez kucia ścian, bez zmartwień i bez dodatkowych opłat abonamentowych.</>
              )}
              {lang === "ENG" && (
                <>The <strong>Your SMART Home</strong> system is a revolution in home automation. Fully wireless components installed directly by our company. No wall breaking, no worries, and no monthly subscription fees.</>
              )}
              {lang === "CZ" && (
                <>Systém <strong>Váš SMART Home</strong> představuje revoluci v domácí automatizaci. Plně bezdrátové prvky instalované přímo naší firmou. Bez sekání do zdí, bez starostí a bez dalších poplatků za předplatné.</>
              )}
            </p>

            {/* Micro Rating Indicator */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-zinc-100 inline-block shadow-3xs">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current text-amber-500" />
                ))}
              </div>
              <span className="text-xs font-extrabold text-zinc-900 font-mono">4.9/5</span>
              <span className="text-[11px] text-zinc-400 font-bold border-l border-zinc-150 pl-3">{t("Ponad 180 zadowolonych klientów!", "Over 180 satisfied customers!", "Více než 180 spokojených zákazníků!")}</span>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a 
                href="#konfigurator" 
                className="bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold py-3.5 px-7 rounded-xl uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
              >
                {t("Stwórz własny zestaw", "Create your own kit", "Vytvořte si vlastní sadu")} <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="#cechy" 
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold py-3.5 px-7 rounded-xl uppercase tracking-wider transition-all"
              >
                {t("Zobacz jak to działa", "See how it works", "Podívejte se, jak to funguje")}
              </a>
            </div>
          </div>

          {/* Right visual picture card */}
          <div className="md:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden border border-zinc-200 shadow-xl bg-white p-2 w-full h-[300px] sm:h-[400px] md:w-[600px] md:h-[500px] mx-auto flex items-center justify-center">
              <img 
                src="/Foto/1.png" 
                alt="Inteligentny dom Twój SMART Home Hub" 
                className="w-full h-full object-contain rounded-2xl animate-fade-in"
                referrerPolicy="no-referrer"
              />
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
                {t("Dlaczego warto wybrać Twój SMART Home?", "Why choose Your SMART Home?", "Proč si vybrat Váš SMART Home?")}
              </h2>
              <p className="text-zinc-500 text-xs md:text-sm mt-2">
                {t("Trzy fundamenty nowoczesnego zarządzania domem: zero problematycznych instalacji, zero abonamentów, pełne zaufanie.", "Three pillars of modern home management: zero complex installations, zero subscription fees, full trust.", "Tři pilíře moderní správy domácnosti: nulové složité instalace, nulové předplatné, plná důvěra.")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Feature card point 1 */}
              <div className="p-6 rounded-2xl border border-zinc-150/80 bg-zinc-50/30 flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-zinc-100 text-zinc-950 rounded-xl w-fit mb-4 border border-zinc-200">
                    <Check className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h3 className="font-extrabold uppercase tracking-wider text-[11px] text-zinc-900">{t("Bezinwazyjny montaż w cenie", "Non-invasive installation included", "Neinvazivní montáž v ceně")}</h3>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                    {t("Nasi certyfikowani instalatorzy bezinwazyjnie zamontują i skonfigurują wszystkie elementy. Czysto, szybko i bez zmartwień!", "Our certified installers will non-invasively mount and configure all components. Clean, fast, and worry-free!", "Naši certifikovaní technici neinvazivně namontují a nakonfigurují všechny prvky. Čistě, rychle a bez starostí!")}
                  </p>
                </div>
              </div>

              {/* Feature card point 2 */}
              <div className="p-6 rounded-2xl border border-zinc-150/80 bg-zinc-50/30 flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-zinc-100 text-zinc-950 rounded-xl w-fit mb-4 border border-zinc-200">
                    <Shield className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h3 className="font-extrabold uppercase tracking-wider text-[11px] text-zinc-900">{t("Brak opłat abonamentowych", "No monthly subscription fees", "Žádné měsíční poplatky")}</h3>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                    {t("Kupujesz urządzenie raz na zawsze. Otrzymujesz powiadomienia na telefon, nagrania z kamer w technologii offline i darmową aplikację całkowicie za darmo.", "You buy the device once and own it forever. Get phone notifications, offline camera recordings, and a completely free app with no extra charges.", "Zařízení si koupíte jednou provždy. Získáte upozornění na telefon, záznamy z kamer v offline režimu a bezplatnou aplikaci zcela zdarma.")}
                  </p>
                </div>
              </div>

              {/* Feature card point 3 */}
              <div className="p-6 rounded-2xl border border-zinc-150/80 bg-zinc-50/30 flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-zinc-100 text-zinc-950 rounded-xl w-fit mb-4 border border-zinc-200">
                    <Shield className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h3 className="font-extrabold uppercase tracking-wider text-[11px] text-zinc-900">{t("Bezprzewodowy alarm", "Wireless alarm system", "Bezdrátový alarm")}</h3>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                    {t("Nowoczesny alarm dla Twojego DOMU I FIRMY. Bezinwazyjny montaż bez przeciągania kabli oraz pełne zdalne sterowanie w zasięgu Twojej ręki.", "A modern alarm system for your HOME & BUSINESS. Non-invasive installation without pulling cables and full remote control at your fingertips.", "Moderní alarm pro váš DOMOV I FIRMU. Neinvazivní montáž bez tahání kabelů a plné dálkové ovládání na dosah ruky.")}
                  </p>
                </div>
              </div>

              {/* Feature card point 4 */}
              <div className="p-6 rounded-2xl border border-zinc-150/80 bg-zinc-50/30 flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-zinc-100 text-zinc-950 rounded-xl w-fit mb-4 border border-zinc-200">
                    <Lock className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h3 className="font-extrabold uppercase tracking-wider text-[11px] text-zinc-900">{t("Zdalna SMART klamka", "Remote SMART lock handle", "Chytrá SMART klika")}</h3>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                    {t("Wygodne otwieranie na 4 sposoby: zdalnie z poziomu aplikacji, zbliżeniową kartą RFID, bezpiecznym kodem PIN lub tradycyjnym kluczem awaryjnym. Pełna kontrola dostępu w Twoich rękach.", "Convenient opening in 4 ways: remotely via app, proximity RFID card, secure PIN code, or traditional emergency key. Complete access control in your hands.", "Pohodlné otevírání na 4 způsoby: na dálku z aplikace, bezkontaktní RFID kartou, bezpečným PIN kódem nebo tradičním nouzovým klíčem. Kompletní kontrola přístupu ve vašich rukou.")}
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
              <h2 className="text-2xl font-black text-zinc-950 leading-tight">{t("Zgłoszenie zostało wysłane!", "Application has been sent!", "Žádost byla odeslána!")}</h2>
              <p className="text-xs text-zinc-400 mt-1 capitalize">{t("ID zapytania:", "Inquiry ID:", "ID poptávky:")} <span className="font-mono font-bold text-zinc-800">{orderSummary.id}</span></p>
            </div>

            <div className="bg-zinc-50 rounded-2xl p-4.5 border border-zinc-100 text-xs space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-zinc-400">{t("Data zgłoszenia:", "Application date:", "Datum podání:")}</span>
                <span className="font-bold text-zinc-850">{orderSummary.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">{t("Kontakt:", "Contact:", "Kontakt:")}</span>
                <span className="font-bold text-zinc-850">{orderSummary.fullname}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">{t("Adres montażu:", "Installation address:", "Adresa montáže:")}</span>
                <span className="font-bold text-zinc-850 text-right max-w-[200px] truncate" title={orderSummary.address}>{orderSummary.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">{t("Status wyceny:", "Quote status:", "Stav kalkulace:")}</span>
                <span className="font-bold text-emerald-700">
                  {orderSummary.paymentMethodName.includes("Bezpłatna") 
                    ? t("Bezpłatna wycena i audyt u klienta", "Free on-site estimate & audit", "Bezplatný odhad a audit na místě") 
                    : orderSummary.paymentMethodName}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-200">
                <span className="text-zinc-400 font-semibold">{t("Proponowany termin audytu:", "Proposed audit date:", "Navrhovaný termín auditu:")}</span>
                <span className="font-bold text-zinc-950 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{orderSummary.deliveryDate}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-zinc-400 border-b border-zinc-100 pb-1">{t("Specyfikacja wybranej konfiguracji", "Specification of the selected configuration", "Specifikace zvolené konfigurace")}</h4>
              
              {orderSummary.itemsOrdered.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-xs py-1">
                  <span className="text-zinc-650">
                    {item.name.includes("Montaż Twój SMART Home") ? t("Montaż Twój SMART Home", "Twój SMART Home Installation", "Instalace Twój SMART Home") :
                     item.name.includes("Singiel") ? t("Kamera Bezprzewodowa (Singiel)", "Wireless Camera (Single)", "Bezdrátová kamera (Single)") :
                     item.name.includes("Dual") ? t("Kamera Bezprzewodowa (Dual)", "Wireless Camera (Dual)", "Bezdrátová kamera (Dual)") :
                     item.name.includes("WiFi 6") ? t("Aktualizacja WiFi do DualBand WiFi 6", "WiFi Upgrade to DualBand WiFi 6", "Upgrade WiFi na DualBand WiFi 6") :
                     item.name.includes("WiFi 7") ? t("Aktualizacja WiFi do DualBand WiFi 7", "WiFi Upgrade to DualBand WiFi 7", "Upgrade WiFi na DualBand WiFi 7") :
                     item.name.includes("Zamek") ? t("Zamek Smart Lock Twój SMART Home Lock", "Smart Lock Your SMART Home Lock", "Zámek Smart Lock Váš SMART Home Lock") :
                     (item.name.includes("Zalania") || item.name.includes("Dymu")) ? t("Czujnik Zalania / Dymu Twój SMART Home", "Water Leak / Smoke Sensor Your SMART Home", "Senzor zatopení / kouře Váš SMART Home") :
                     item.name.includes("Podstawowa") ? t("System Alarmowy (Wersja Podstawowa)", "Alarm System (Basic Version)", "Poplašný systém (Základní verze)") :
                     item.name.includes("Zaawansowana") ? t("System Alarmowy (Wersja Zaawansowana)", "Alarm System (Advanced Version)", "Poplašný systém (Pokročilá verze)") :
                     item.name.includes("konfiguracja") ? t("Profesjonalny montaż i konfiguracja", "Professional installation and configuration", "Profesionální montáž a konfigurace") :
                     item.name} <strong className="text-zinc-905">x{item.qty}</strong>
                  </span>
                  <span className="text-zinc-900 font-bold font-mono">{item.price} zł</span>
                </div>
              ))}

              <div className="flex justify-between text-xs py-1 border-t border-zinc-100 pt-2">
                <span className="text-zinc-450">{t("Dojazd i audyt na miejscu:", "Travel & audit on site:", "Příjezd a audit na místě:")}</span>
                <span className="text-emerald-700 font-bold">
                  {t("Darmowy", "Free", "Zdarma")}
                </span>
              </div>
              {orderSummary.discountAmount > 0 && (
                <div className="flex justify-between text-xs py-1 text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                  <span>{t("Uwzględniony rabat konfiguratora (10%):", "Configurator discount included (10%):", "Zahrnutá sleva konfigurátoru (10%):")}</span>
                  <span className="font-bold font-mono">-{orderSummary.discountAmount} zł</span>
                </div>
              )}

              <div className="flex justify-between text-base py-3 border-t border-dashed border-zinc-200 mt-2 font-black text-zinc-950">
                <span>{t("Szacowany koszt zestawu z montażem:", "Estimated cost with installation:", "Odhadovaná cena sady s montáží:")}</span>
                <span className="font-mono text-lg text-emerald-700">{orderSummary.finalTotalPrice} zł</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all shadow-3xs cursor-pointer text-center"
              >
                {t("Konfiguruj nowy zestaw", "Configure a new kit", "Konfigurovat novou sadu")}
              </button>
            </div>
          </div>
        ) : (
          /* Normal kit configuration state */
          <div>
            <div className="text-center max-w-xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-zinc-100 rounded-full text-[10px] font-extrabold text-zinc-800 uppercase tracking-widest mb-2">
                {t("Zbuduj swój inteligentny dom", "Build your smart home", "Sestavte si svůj chytrý domov")}
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-950 tracking-tight">
                {t("Kreator Zestawu", "Kit Creator", "Konfigurátor sady")}
              </h2>
              <p className="text-zinc-500 text-xs md:text-sm mt-1">
                {t("Wybierz dowolną liczbę elementów, które chcesz zainstalować w swoim inteligentnym domu.", "Select any number of items you want to install in your smart home.", "Vyberte libovolný počet prvků, které chcete nainstalovat do svého chytrého domova.")}
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column Configurator Options - Grid 7 */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* 1. Base Hub Card (fixed) */}
                <div className="bg-white p-5 rounded-2xl border border-zinc-150 flex items-center justify-between shadow-3xs relative overflow-hidden">
                  <div className="absolute right-0 top-0 bg-zinc-900 text-white text-[9px] font-bold py-1 px-3 uppercase tracking-wider rounded-bl-xl font-mono">
                    {t("W zestawie", "Included", "V sadě")}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-zinc-50 border border-zinc-150 rounded-xl flex items-center justify-center">
                      <SmartHomeEmblem size={28} className="-m-0.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5">
                        {t("Montaż Twój SMART Home", "Your SMART Home Installation", "Montáž Váš SMART Home")}
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        {t("Profesjonalny montaż już od 59 zł dla 1 urządzenia. Bezpłatny dojazd do klienta.", "Professional installation from 59 PLN per 1 device. Free customer visit.", "Profesionální montáž již od 59 Kč za 1 zařízení. Bezplatná doprava k zákazníkovi.")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right pl-4">
                    <span className="font-mono text-sm font-black text-zinc-900 whitespace-nowrap">{montazPrice} zł</span>
                    <p className="text-[10px] text-zinc-400 tracking-wider font-bold uppercase">
                      {lang === "PL" && (selectedDevicesCount === 1 ? "1 URZĄDZENIE" : (selectedDevicesCount >= 2 && selectedDevicesCount <= 4) ? `${selectedDevicesCount} URZĄDZENIA` : `${selectedDevicesCount} URZĄDZEŃ`)}
                      {lang === "ENG" && (selectedDevicesCount === 1 ? "1 DEVICE" : `${selectedDevicesCount} DEVICES`)}
                      {lang === "CZ" && (selectedDevicesCount === 1 ? "1 ZAŘÍZENÍ" : `${selectedDevicesCount} ZAŘÍZENÍ`)}
                    </p>
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
                        {t("Kamery Bezprzewodowe Twój SMART Home Cam HD", "Wireless Cameras Your SMART Home Cam HD", "Bezdrátové kamery Váš SMART Home Cam HD")}
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        {t("Bezprzewodowe kamery z wbudowanym trybem nocnym (IR), detekcją ruchu i zasilaniem akumulatorowym. Wybierz wersję Singiel, Dual lub obie jednocześnie!", "Wireless cameras with built-in night vision (IR), motion detection, and battery power. Choose Single, Dual, or both!", "Bezdrátové kamery s integrovaným nočním viděním (IR), detekcí pohybu a akumulátorovým napájením. Zvolte verzi Single, Dual nebo obě najednou!")}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-zinc-100 pt-3 space-y-4">
                    {/* Wersja Singiel Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-extrabold text-zinc-900 uppercase tracking-wide">{t("Wersja Singiel", "Single Version", "Verze Single")}</span>
                          <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md font-mono font-bold">{CAM_SINGLE_UNIT_PRICE} zł / {t("szt.", "pcs", "ks")}</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{t("Podstawowy obiektyw HD 1080p, szeroki kąt widzenia 110°.", "Basic HD 1080p lens, wide 110° angle of view.", "Základní objektiv HD 1080p, široký úhel záběru 110°.")}</p>
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
                          <span className="text-[11px] font-extrabold text-zinc-900 uppercase tracking-wide">{t("Wersja Dual", "Dual Version", "Verze Dual")}</span>
                          <span className="text-[10px] bg-zinc-950 text-white px-2 py-0.5 rounded-md font-mono font-bold">{CAM_DUAL_UNIT_PRICE} zł / {t("szt.", "pcs", "ks")}</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{t("Szerokokątny obiektyw 2.5K sterowany zdalnie, kąt widzenia do 180°.", "Wide-angle 2.5K lens controlled remotely, up to 180° angle of view.", "Širokoúhlý objektiv 2.5K s dálkovým ovládáním, úhel záběru až 180°.")}</p>
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
                        {t("Zamek Smart Lock Twój SMART Home Lock", "Smart Lock Your SMART Home Lock", "Zámek Smart Lock Váš SMART Home Lock")}
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        {t("Bezpieczny rygiel elektromechaniczny na drzwi wejściowe. Otwieranie kodem PIN (goście), aplikacją lub brelokiem NFC, a nawet odciskiem palca.", "Secure electromechanical bolt for front doors. Opening with PIN code (guests), app, NFC fob, or even fingerprint.", "Bezpečný elektromechanický zámek pro vstupní dveře. Otevírání pomocí PIN kódu (hosté), aplikace, NFC klíčenky nebo otisku prstu.")}
                      </p>
                      <span className="inline-block mt-2 font-mono text-[11px] font-bold text-zinc-550">+{LOCK_UNIT_PRICE} zł {t("za sztukę", "per piece", "za kus")}</span>
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
                        {t("Czujnik Zalania / Dymu Twój SMART Home", "Water Leak / Smoke Sensor Twój SMART Home", "Senzor zatopení / kouře Váš SMART Home")}
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        {t("Kompaktowy, bezprzewodowy czujnik, który chroni przed zalaniem lub pożarem. Błyskawicznie alarmuje w przypadku wykrycia nieszczelności rury lub pojawienia się dymu.", "Compact, wireless sensor protecting against water damage or fire. Instantly alerts upon detecting a pipe leak or smoke.", "Kompaktní, bezdrátový senzor chránící před vytopením nebo požárem. Okamžitě upozorní při zjištění úniku vody z potrubí nebo kouře.")}
                      </p>
                      <span className="inline-block mt-2 font-mono text-[11px] font-bold text-zinc-550">+{FLOOD_UNIT_PRICE} zł {t("za sztukę", "per piece", "za kus")}</span>
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

                {/* 5. Bezprzewodowy System Alarmowy */}
                <div className="bg-white p-5 rounded-2xl border border-zinc-150 flex flex-col gap-4 shadow-3xs hover:border-zinc-300 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-zinc-50 text-zinc-900 border border-zinc-150 rounded-xl shrink-0">
                      <Shield className="w-5 h-5 text-zinc-950 stroke-[1.75]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5 flex-wrap">
                        {t("Bezprzewodowy System Alarmowy", "Wireless Alarm System", "Bezdrátový poplašný systém")} <span className="bg-zinc-950 text-white px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wide">{t("Bez kabli i wiercenia", "No cables & drilling", "Bez kabelů a vrtání")}</span>
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        {t("Nowoczesny alarm dla Twojego DOMU I FIRMY. Szybki, bezinwazyjny montaż z pełnym zdalnym sterowaniem w aplikacji na smartfonie. Wybierz wersję dopasowaną do Twoich potrzeb.", "A modern alarm system for your HOME & BUSINESS. Fast, non-invasive installation with full remote control in the smartphone app. Choose the version tailored to your needs.", "Moderní alarm pro váš DOMOV I FIRMU. Rychlá, neinvazivní montáž s plným dálkovým ovládáním v aplikaci na chytrém telefonu. Zvolte verzi přizpůsobenou vašim potřebám.")}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-zinc-100 pt-3.5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setAlarmType("none")}
                      className={`flex-1 min-w-[120px] text-[10px] font-extrabold uppercase px-3 py-2.5 rounded-xl border transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 ${
                        alarmType === "none"
                          ? "bg-zinc-950 border-zinc-950 text-white shadow-3xs"
                          : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100"
                      }`}
                    >
                      <span className="font-extrabold">{t("Brak alarmu", "No Alarm", "Žádný alarm")}</span>
                      <span className="text-[9px] font-mono tracking-wider opacity-80">(0 zł)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlarmType("basic")}
                      className={`flex-1 min-w-[120px] text-[10px] font-extrabold uppercase px-3 py-2.5 rounded-xl border transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 ${
                        alarmType === "basic"
                          ? "bg-zinc-950 border-zinc-950 text-white shadow-2xs"
                          : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100"
                      }`}
                    >
                      <span className="font-extrabold">{t("Alarm Podstawowy 🛡️", "Basic Alarm 🛡️", "Základní alarm 🛡️")}</span>
                      <span className="text-[9px] font-mono tracking-wider opacity-80">+{ALARM_BASIC_PRICE} zł</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlarmType("advanced")}
                      className={`flex-1 min-w-[120px] text-[10px] font-extrabold uppercase px-3 py-2.5 rounded-xl border transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 ${
                        alarmType === "advanced"
                          ? "bg-zinc-950 border-zinc-950 text-white shadow-2xs"
                          : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100"
                      }`}
                    >
                      <span className="font-extrabold">{t("Alarm Zaawansowany 🚀", "Advanced Alarm 🚀", "Pokročilý alarm 🚀")}</span>
                      <span className="text-[9px] font-mono tracking-wider opacity-80">+{ALARM_ADVANCED_PRICE} zł</span>
                    </button>
                  </div>
                  
                  {alarmType === "basic" && (
                    <p className="text-[10px] text-zinc-400 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100 leading-relaxed">
                      <strong>{t("Zestaw podstawowy:", "Basic set:", "Základní sada:")}</strong> {t("Bezprzewodowa centrala alarmowa, czujniki ruchu (PIR), głośny sygnalizator akustyczny (syrena wewnętrzna) oraz 2 piloty sterujące. Optymalny dla mniejszych budynków lub mieszkań.", "Wireless control panel, motion sensors (PIR), loud sounder (internal siren), and 2 remote controls. Optimal for smaller buildings or apartments.", "Bezdrátová ústředna, pohybová čidla (PIR), hlasitý vnitřní siréna a 2 dálkové ovladače. Optimální pro menší objekty nebo byty.")}
                    </p>
                  )}
                  {alarmType === "advanced" && (
                    <p className="text-[10px] text-zinc-400 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100 leading-relaxed">
                      <strong>{t("Zestaw zaawansowany:", "Advanced set:", "Pokročilá sada:")}</strong> {t("Centrala GSM z podtrzymaniem bateryjnym, komplet czujników ruchu, czujniki magnetyczne otwarcia drzwi/okien, silna bezprzewodowa syrena zewnętrzna, bezprzewodowa klawiatura kodowa oraz sterowanie smartfonem. Maksymalne bezpieczeństwo dla Twojego domu i firmy.", "GSM control panel with battery backup, motion sensors kit, magnetic door/window opening sensors, powerful wireless outdoor siren, wireless keypad, and smartphone control. Maximum security for your home and business.", "GSM ústředna se záložní baterií, sada pohybových čidel, magnetické senzory otevření dveří/oken, výkonná bezdrátová venkovní siréna, bezdrátová klávesnice a ovládání z chytrého telefonu. Maximální zabezpečení pro váš domov i firmu.")}
                    </p>
                  )}
                </div>

                {/* 6. WiFi Upgrade Controller */}
                <div className="bg-white p-5 rounded-2xl border border-zinc-150 flex flex-col gap-4 shadow-3xs hover:border-zinc-300 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-zinc-50 text-zinc-900 border border-zinc-150 rounded-xl shrink-0">
                      <Wifi className="w-5 h-5 text-zinc-950 stroke-[1.75]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5 flex-wrap">
                        {t("Modernizacja istniejącego WiFi w budynku", "Upgrade of existing WiFi in the building", "Modernizace stávající WiFi v budově")} <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wide border border-emerald-150">{t("Polecane dla kamer", "Recommended for cameras", "Doporučeno pro kamery")}</span>
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        {t("Zmodernizujemy Twoją obecną sieć WiFi do nowoczesnego, stabilnego standardu DualBand WiFi 6 lub WiFi 7 wraz z pełną konfiguracją pod inteligentne urządzenia i testami pokrycia sygnałem.", "We will upgrade your current WiFi network to a modern, stable DualBand WiFi 6 or WiFi 7 standard, including full configuration for smart devices and signal coverage tests.", "Zmodernizujeme vaši stávající WiFi síť na moderní, stabilní standard DualBand WiFi 6 nebo WiFi 7 včetně kompletní konfigurace pro chytrá zařízení a testů pokrytí signálem.")}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-zinc-100 pt-3.5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setWifiUpgrade("none")}
                      className={`flex-1 min-w-[130px] text-[10px] font-extrabold uppercase px-3 py-2.5 rounded-xl border transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 ${
                        wifiUpgrade === "none"
                          ? "bg-zinc-950 border-zinc-950 text-white shadow-3xs"
                          : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100"
                      }`}
                    >
                      <span className="font-extrabold">{t("Bez aktualizacji", "No upgrade", "Bez aktualizace")}</span>
                      <span className="text-[9px] font-mono tracking-wider opacity-80">(0 zł)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWifiUpgrade("wifi6")}
                      className={`flex-1 min-w-[130px] text-[10px] font-extrabold uppercase px-3 py-2.5 rounded-xl border transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 ${
                        wifiUpgrade === "wifi6"
                          ? "bg-zinc-950 border-zinc-950 text-white shadow-2xs"
                          : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100"
                      }`}
                    >
                      <span className="font-extrabold">DualBand WiFi 6 🚀</span>
                      <span className="text-[9px] font-mono tracking-wider opacity-80">+{WIFI_6_PRICE} {t("zł z konfig.", "PLN w/ config", "Kč s konfig.")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWifiUpgrade("wifi7")}
                      className={`flex-1 min-w-[130px] text-[10px] font-extrabold uppercase px-3 py-2.5 rounded-xl border transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 ${
                        wifiUpgrade === "wifi7"
                          ? "bg-zinc-950 border-zinc-950 text-white shadow-2xs"
                          : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100"
                      }`}
                    >
                      <span className="font-extrabold">DualBand WiFi 7 ⚡</span>
                      <span className="text-[9px] font-mono tracking-wider opacity-80">+{WIFI_7_PRICE} {t("zł z konfig.", "PLN w/ config", "Kč s konfig.")}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column Summary & Interactive Checkout Form - Grid 5 */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Visual live order value breakdown */}
                <div className="bg-white p-6 rounded-3xl border border-zinc-150 shadow-sm space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-950 pb-2 border-b border-zinc-100 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-zinc-950" /> {t("Podsumowanie zestawu", "Kit Summary", "Shrnutí sady")}
                  </h3>

                  <div className="space-y-3.5 text-xs">
                    
                    <div className="flex justify-between font-mono">
                      <span className="text-zinc-500">{t("Montaż Twój SMART Home", "Twój SMART Home Installation", "Instalace Twój SMART Home")} ({selectedDevicesCount} {t("urządz.", "devices", "zaříz.")})</span>
                      <span className="font-bold text-zinc-900">{montazPrice} zł</span>
                    </div>

                    {camsSingle > 0 && (
                      <div className="flex justify-between font-mono">
                        <span className="text-zinc-500">{camsSingle}x {t("Kamera SMART Home (Singiel)", "SMART Home Cam (Single)", "SMART Home Cam (Single)")}</span>
                        <span className="font-bold text-zinc-900">+{camsSingle * CAM_SINGLE_UNIT_PRICE} zł</span>
                      </div>
                    )}

                    {camsDual > 0 && (
                      <div className="flex justify-between font-mono">
                        <span className="text-zinc-500">{camsDual}x {t("Kamera SMART Home (Dual)", "SMART Home Cam (Dual)", "SMART Home Cam (Dual)")}</span>
                        <span className="font-bold text-zinc-900">+{camsDual * CAM_DUAL_UNIT_PRICE} zł</span>
                      </div>
                    )}

                    {locks > 0 && (
                      <div className="flex justify-between font-mono">
                        <span className="text-zinc-500">{locks}x {t("Inteligentny Zamek", "Smart Lock", "Inteligentní zámek")}</span>
                        <span className="font-bold text-zinc-900">+{locksPrice} zł</span>
                      </div>
                    )}

                    {floods > 0 && (
                      <div className="flex justify-between font-mono">
                        <span className="text-zinc-500">{floods}x {t("Czujnik Zalania / Dymu", "Water Leak / Smoke Sensor", "Senzor zatopení / kouře")}</span>
                        <span className="font-bold text-zinc-900">+{floodsPrice} zł</span>
                      </div>
                    )}

                    {alarmType !== "none" && (
                      <div className="flex justify-between font-mono">
                        <span className="text-zinc-500">1x {t("Bezprzewodowy Alarm", "Wireless Alarm", "Bezdrátový alarm")} ({alarmType === "basic" ? t("Podstawowy", "Basic", "Základní") : t("Zaawansowany", "Advanced", "Pokročilý")})</span>
                        <span className="font-bold text-zinc-900">+{alarmPrice} zł</span>
                      </div>
                    )}

                    {wifiUpgrade !== "none" && (
                      <div className="flex justify-between font-mono">
                        <span className="text-zinc-500">1x {t("Modernizacja WiFi", "WiFi Upgrade", "Modernizace WiFi")} ({wifiUpgrade === "wifi6" ? "DualBand WiFi 6" : "DualBand WiFi 7"})</span>
                        <span className="font-bold text-zinc-900">+{wifiUpgradePrice} zł</span>
                      </div>
                    )}

                    {includeInstallation && installationCost > 0 && (
                      <div className="flex justify-between font-mono bg-zinc-50 p-2 rounded-xl border border-zinc-100 text-[11px] items-center text-zinc-650">
                        <span className="flex items-center gap-1 font-semibold">🔧 {t("Montaż i konfiguracja (Wymagany — {count} urządz.):", "Installation & config (Required — {count} devices):", "Montáž a konfigurace (Vyžadováno — {count} zaříz.):").replace("{count}", String(totalItemCount))}</span>
                        <span className="font-bold text-zinc-900">+{installationCost} zł</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-zinc-100 text-[11px] flex justify-between items-center text-zinc-500">
                      <span>{t("Metoda transportu:", "Shipping method:", "Způsob dopravy:")}</span>
                      <span className="font-bold text-zinc-900">{t("Dowóz przez ekipę montażową", "Delivery by installation crew", "Doručení instalační četou")}</span>
                    </div>

                    <div className="flex justify-between font-mono text-zinc-500 pb-1">
                      <span>{t("Koszt transportu i dostawy:", "Transport & delivery cost:", "Cena za dopravu a doručení:")}</span>
                      <span className="font-bold text-zinc-900">
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-sans text-[10px] font-bold uppercase tracking-wide">{t("Darmowa dostawa (z montażem)", "Free delivery (with installation)", "Doprava zdarma (s montáží)")}</span>
                      </span>
                    </div>

                    {/* Applied discount display */}
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 text-[11px]">
                        <span className="font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> {t("Rabat 10% aktywowany", "10% Discount activated", "10% sleva aktivována")}
                        </span>
                        <strong className="font-mono">-{discountAmount} zł</strong>
                      </div>
                    )}

                  </div>

                  {/* Promo Code Input block */}
                  <div className="pt-3 border-t border-zinc-100 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 block">{t("Dopasuj kod kuponu rabatowego", "Apply discount coupon code", "Použít slevový kupón")}</span>
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
                        className="bg-zinc-900 hover:bg-zinc-850 text-white text-[11px] font-bold uppercase tracking-wider px-4 rounded-xl transition-colors cursor-pointer"
                      >
                        {t("Zastosuj", "Apply", "Použít")}
                      </button>
                    </div>
                    {promoError && <p className="text-[10px] text-red-500 font-bold font-mono">{promoError}</p>}
                    {promoSuccess && <p className="text-[10px] text-emerald-600 font-bold">{promoSuccess}</p>}
                  </div>

                  {/* Pricing Total block */}
                  <div className="pt-4 border-t border-dashed border-zinc-200 flex items-baseline justify-between font-black text-zinc-950">
                    <span className="text-sm">{t("Razem brutto:", "Total gross:", "Celkem s DPH:")}</span>
                    <div className="text-right">
                      <span className="text-2xl font-mono">{finalTotalPrice} zł</span>
                      <p className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">{t("Przesyłka wliczona", "Delivery included", "Doprava v ceně")}</p>
                    </div>
                  </div>

                  <hr className="border-zinc-100" />

                  {/* CTA Checkout Toggle triggers checkout scroll or view */}
                  {checkoutStep !== "checkout" && (
                    <button
                      onClick={() => setCheckoutStep("checkout")}
                      className="w-full bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold py-3.5 rounded-2xl uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {t("Dalej: Dane do montażu", "Next: Installation details", "Dále: Instalační údaje")} <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                </div>

                {/* Lead shipping and payment fields if activated */}
                {checkoutStep === "checkout" && (
                  <div id="order-form-container" className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-md space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                      <h3 className="text-xs font-black uppercase tracking-wider text-zinc-950">
                        {t("Dane do bezpłatnej wyceny i montażu", "Data for free estimate & installation", "Údaje pro bezplatný odhad a montáž")}
                      </h3>
                      <button 
                        onClick={() => setCheckoutStep("config")} 
                        className="text-[10px] font-bold text-zinc-400 hover:text-zinc-800 uppercase"
                      >
                        {t("Wróć do wyboru", "Back to choice", "Zpět k výběru")}
                      </button>
                    </div>

                    <form onSubmit={handlePlaceOrder} className="space-y-3.5">
                      
                      {/* Name fields */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 block mb-1">{t("Imię i nazwisko", "Full Name", "Jméno a příjmení")}</label>
                        <input 
                          type="text" 
                          value={fullname}
                          onChange={(e) => setFullname(e.target.value)}
                          placeholder={t("Np. Jan Kowalski", "e.g. John Doe", "Např. Jan Novák")}
                          className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-zinc-650"
                        />
                        {formErrors.fullname && <span className="text-[10px] text-red-500 font-bold font-mono mt-0.5 block">{formErrors.fullname}</span>}
                      </div>

                      {/* Phone / Email grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-455 block mb-1">{t("Adres E-mail", "Email Address", "E-mailová adresa")}</label>
                          <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t("jan@domena.pl", "john@domain.com", "jan@domena.cz")}
                            className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-zinc-650"
                          />
                          {formErrors.email && <span className="text-[10px] text-red-500 font-bold font-mono mt-0.5 block">{formErrors.email}</span>}
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-455 block mb-1">{t("Numer telefonu", "Phone Number", "Telefonní číslo")}</label>
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
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-455 block mb-1">{t("Ulica i numer lokalu (adres montażu)", "Street & building number (installation address)", "Ulice a číslo domu (adresa montáže)")}</label>
                        <input 
                          type="text" 
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder={t("Mickiewicza 12m. 4", "Main Street 12", "Mickiewiczova 12")}
                          className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-zinc-650"
                        />
                        {formErrors.street && <span className="text-[10px] text-red-500 font-bold font-mono mt-0.5 block">{formErrors.street}</span>}
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-455 block mb-1">{t("Kod pocztowy", "Postal Code", "Poštovní směrovací číslo")}</label>
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
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-455 block mb-1">{t("Miasto", "City", "Město")}</label>
                          <input 
                            type="text" 
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder={t("Warszawa", "Warsaw", "Praha")}
                            className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-zinc-650"
                          />
                          {formErrors.city && <span className="text-[10px] text-red-500 font-bold font-mono mt-0.5 block">{formErrors.city}</span>}
                        </div>
                      </div>

                      {/* GDPR Consent Checkbox */}
                      <div className="pt-2">
                        <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-zinc-500 font-medium select-none leading-relaxed">
                          <input 
                            type="checkbox" 
                            checked={consentAccepted}
                            onChange={(e) => setConsentAccepted(e.target.checked)}
                            className="mt-0.5 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 h-3.5 w-3.5"
                          />
                          <span>
                            {t(
                              "Akceptuję ", 
                              "I accept the ", 
                              "Souhlasím s "
                            )}
                            <button 
                              type="button" 
                              onClick={() => setActiveLegalModal("regulamin")} 
                              className="text-zinc-950 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer text-[11px] inline-block font-bold"
                            >
                              {t("regulamin świadczenia usług", "terms of service", "obchodními podmínkami")}
                            </button>
                            {t(" oraz ", " and ", " a ")}
                            <button 
                              type="button" 
                              onClick={() => setActiveLegalModal("polityka")} 
                              className="text-zinc-950 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer text-[11px] inline-block font-bold"
                            >
                              {t("politykę prywatności RODO", "privacy policy", "zásadami ochrany osobních údajů (GDPR)")}
                            </button>
                            {t(
                              " i wyrażam zgodę na darmowy audyt u klienta.", 
                              " and consent to the free on-site audit.", 
                              " a souhlasím s bezplatným auditem na místě."
                            )}
                          </span>
                        </label>
                        {formErrors.consent && <span className="text-[10px] text-red-500 font-bold font-mono mt-1 block">{formErrors.consent}</span>}
                      </div>

                      {/* Ultimate Checkout Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmittingOrder}
                        className="w-full bg-zinc-950 hover:bg-zinc-850 disabled:bg-zinc-300 text-white text-xs font-bold py-4 rounded-2xl uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-4"
                      >
                        {isSubmittingOrder ? t("Wysyłanie konfiguracji...", "Sending configuration...", "Odesílání konfigurace...") : t("Wyślij zapytanie i zamów darmową wycenę", "Send inquiry & order free quote", "Odeslat poptávku a objednat bezplatnou kalkulaci")} <Check className="w-4 h-4" />
                      </button>

                    </form>
                  </div>
                )}



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
                    <a href="mailto:dreamstudiopl@gmail.com" className="text-zinc-950 text-xs font-bold mt-0.5 hover:underline block">
                      dreamstudiopl@gmail.com
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
              <p className="text-zinc-550 text-xs mt-1 mb-6">
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
        </>
      )}

      {/* SEO Regional & Technical Area Directory Section */}
      <section className="bg-zinc-100/50 border-t border-zinc-150 py-10 text-zinc-500 text-xs">
        <div className="max-w-6xl mx-auto px-6">
          <div className="border-b border-zinc-200 pb-6 mb-6">
            <h3 className="text-zinc-900 font-bold text-sm mb-3">
              Lokalny montaż smart home i systemów bezpieczeństwa – Śląsk, Małopolska i okolice
            </h3>
            <p className="text-zinc-500 leading-relaxed max-w-4xl">
              Oferujemy profesjonalne usługi wdrożeniowe i doradztwo z zakresu automatyki domowej oraz ochrony mienia. 
              Nasza specjalność to kompleksowy <strong>smart home montaż</strong>, konfiguracja nowoczesnych sieci oraz zabezpieczeń bez wiercenia i kosztownych abonamentów. 
              Dzięki naszym rozwiązaniom uzyskasz stały podgląd na żywo poprzez <strong>kamery online</strong> (idealne do obserwacji psów i zwierząt podczas nieobecności), 
              zainstalujesz bezpieczne i wygodne <strong>smart klamki dla domu</strong> oraz zoptymalizujesz codzienne zużycie energii. 
              Wybierz sprawdzony, <strong>tani smart home</strong> dopasowany do Twojego budżetu i potrzeb! 
              Świadczymy usługi takie jak profesjonalny <strong>montaż alarmu</strong> oraz precyzyzyjny <strong>montaż kamer IP</strong> z pełną konfiguracją na smartfonie.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase text-zinc-900 tracking-wider">Nasze Usługi</h4>
              <ul className="space-y-1 text-zinc-600">
                <li>• <span className="hover:text-zinc-900 transition-colors">Smart home montaż i konfiguracja</span></li>
                <li>• <span className="hover:text-zinc-900 transition-colors">Montaż kamer IP i systemów wizyjnych</span></li>
                <li>• <span className="hover:text-zinc-900 transition-colors">Montaż alarmu oraz czujników dymu/zalania</span></li>
                <li>• <span className="hover:text-zinc-900 transition-colors">Przełączniki światła WiFi i sterowanie LED</span></li>
                <li>• <span className="hover:text-zinc-900 transition-colors">Konfiguracja routerów i sieci domowych</span></li>
                <li>• <span className="hover:text-zinc-900 transition-colors">Smart klamki dla domu i mieszkań na wynajem</span></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase text-zinc-900 tracking-wider">Twój SMART Home</h4>
              <ul className="space-y-1 text-zinc-600">
                <li>• <span className="hover:text-zinc-900 transition-colors">bielsko-biała smart home</span></li>
                <li>• <span className="hover:text-zinc-900 transition-colors">żywiec smart home</span></li>
                <li>• <span className="hover:text-zinc-900 transition-colors">śląsk smart home (Katowice, Tychy, Gliwice)</span></li>
                <li>• <span className="hover:text-zinc-900 transition-colors">Szczyrk, Wisła, Ustroń, Cieszyn</span></li>
                <li>• <span className="hover:text-zinc-900 transition-colors">Pszczyna, Czechowice-Dziedzice, Kęty</span></li>
                <li>• <span className="hover:text-zinc-900 transition-colors">Andrychów, Wadowice, Oświęcim</span></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase text-zinc-900 tracking-wider">Małopolska & Kraków</h4>
              <ul className="space-y-1 text-zinc-600">
                <li>• <span className="hover:text-zinc-900 transition-colors">Kraków smart home i automatyka</span></li>
                <li>• <span className="hover:text-zinc-900 transition-colors">Wieliczka, Skawina, Myślenice</span></li>
                <li>• <span className="hover:text-zinc-900 transition-colors">Chrzanów, Jaworzno, Trzebinia</span></li>
                <li>• <span className="hover:text-zinc-900 transition-colors">Olkusz, Krzeszowice, Dobczyce</span></li>
                <li>• <span className="hover:text-zinc-900 transition-colors">Instalacja kamer IP Kraków</span></li>
                <li>• <span className="hover:text-zinc-900 transition-colors">Tani smart home Małopolska</span></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase text-zinc-900 tracking-wider">Technologie i Standardy</h4>
              <p className="text-zinc-500 leading-relaxed">
                Wdrażamy instalacje w oparciu o bezpieczne protokoły WiFi, Zigbee oraz Thread. Wspieramy integracje z Google Home, Apple HomeKit i Home Assistant. Zapewniamy darmowe konsultacje techniczne na terenie Podbeskidzia, Śląska i Krakowa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer layout */}
      <footer className="bg-zinc-50 border-t border-zinc-150 py-12 text-zinc-500 text-xs">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 items-start text-left">
          
          {/* Logo & copyright */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <SmartHomeEmblem size={32} />
              <span className="font-extrabold text-[15px] text-zinc-950 tracking-tight flex flex-col leading-none">
                <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-widest mb-0.5 leading-none">Twój</span>
                <span>SMART <span className="font-normal text-zinc-500">Home</span></span>
              </span>
              <span className="text-[10px] text-zinc-300">|</span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Original IoT kit</span>
            </div>
            <p 
              onDoubleClick={() => navigateTo("/crm")}
              className="text-zinc-450 leading-relaxed select-none cursor-default"
              title="© 2026 Twój SMART Home"
            >
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
              E-mail: <a href="mailto:dreamstudiopl@gmail.com" className="text-zinc-950 font-bold hover:underline">dreamstudiopl@gmail.com</a>
            </p>
          </div>

          {/* Link info */}
          <div className="md:text-right space-y-3 md:self-stretch flex flex-col justify-between">
            <div className="flex md:justify-end gap-4 text-zinc-450 font-bold uppercase tracking-wider text-[10px]">
              <button 
                onClick={() => setActiveLegalModal("regulamin")} 
                className="hover:text-zinc-900 transition-colors cursor-pointer bg-transparent border-none p-0 uppercase font-bold tracking-wider"
              >
                {t("Regulamin", "Terms & Conditions", "Podmínky")}
              </button>
              <span>•</span>
              <button 
                onClick={() => setActiveLegalModal("polityka")} 
                className="hover:text-zinc-900 transition-colors cursor-pointer bg-transparent border-none p-0 uppercase font-bold tracking-wider"
              >
                {t("Polityka Prywatności", "Privacy Policy", "Zásady ochrany osobních údajů")}
              </button>
            </div>
            <p className="text-[10px] text-zinc-400">
              Dysonowanie i dystrybucja techniczna realizowana przez Dream Studio.
            </p>
          </div>

        </div>
      </footer>

      {/* Dynamic, floating call pop-up/widget visible on all pages & versions */}
      <div id="call-floating-widget" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* The actual speech bubble/pop-up panel */}
        {isCallWidgetOpen && (
          <div className="pointer-events-auto bg-white border border-zinc-200 rounded-2xl p-5 shadow-2xl max-w-[320px] w-[calc(100vw-3rem)] animate-in slide-in-from-bottom-5 fade-in duration-300 relative flex flex-col gap-3">
            
            {/* Elegant horizontal accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-zinc-950 to-emerald-400 rounded-t-2xl" />
            
            {/* Close button */}
            <button 
              onClick={() => {
                setIsCallWidgetOpen(false);
                setHasUserClosedCallWidget(true);
              }}
              className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-900 p-1 rounded-full hover:bg-zinc-100 transition-all cursor-pointer"
              aria-label="Zamknij"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Advisor header */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-zinc-950 text-white rounded-full flex items-center justify-center border border-zinc-850 font-extrabold text-[10px] tracking-wider uppercase">
                  SMART
                </div>
                {/* Green active pulse indicator */}
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-200">
                  DORADCA LIVE
                </span>
                <h4 className="text-xs font-black text-zinc-950 mt-0.5">SANDRA - Ekspert Smart Home</h4>
              </div>
            </div>

            {/* Description Text */}
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Masz pytania dotyczące inteligentnego domu, kamer WiFi lub alarmów lub modernizacji sieci internetowej? Zadzwoń bezpośrednio! Chętnie doradzę i przygotuję <strong>bezpłatną wycenę</strong>.
            </p>

            {/* Main Phone Number link */}
            <a 
              href="tel:+48500184999"
              className="group flex items-center justify-between gap-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-150 p-3 rounded-xl transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-zinc-950 text-white rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                  <PhoneCall className="w-4 h-4 text-emerald-400 animate-bounce" />
                </div>
                <div className="text-left">
                  <span className="block text-[8px] text-zinc-400 uppercase tracking-widest font-semibold">Zadzwoń bezpośrednio</span>
                  <span className="block text-sm font-black text-zinc-950 font-mono tracking-tight">+48 500 184 999</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <a 
                href="tel:+48500184999"
                className="flex-1 bg-zinc-950 hover:bg-zinc-850 text-white text-[11px] font-bold py-2.5 px-4 rounded-xl uppercase tracking-wider transition-all shadow-sm text-center cursor-pointer"
              >
                Połącz teraz
              </a>
              <button 
                onClick={() => {
                  setIsCallWidgetOpen(false);
                  setHasUserClosedCallWidget(true);
                }}
                className="text-zinc-500 hover:text-zinc-900 text-[10px] font-bold py-2 px-3 rounded-lg hover:bg-zinc-50 transition-all cursor-pointer"
              >
                Może później
              </button>
            </div>
          </div>
        )}

        {/* Floating circular activator button */}
        <button
          onClick={() => setIsCallWidgetOpen(!isCallWidgetOpen)}
          className="pointer-events-auto w-14 h-14 bg-zinc-950 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all relative border border-zinc-850 cursor-pointer"
          id="btn-call-floating-trigger"
          title="Zadzwoń do eksperta"
        >
          {/* Outer pulsing ring */}
          <span className="absolute -inset-1.5 rounded-full bg-zinc-950/10 border-2 border-zinc-950/20 animate-ping pointer-events-none" />
          <span className="absolute -inset-3 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 animate-pulse pointer-events-none" />
          
          {isCallWidgetOpen ? (
            <X className="w-6 h-6 rotate-0 transition-transform duration-300" />
          ) : (
            <PhoneCall className="w-5 h-5 text-emerald-400 animate-pulse" />
          )}

          {/* Unread message count badge */}
          {!isCallWidgetOpen && !hasUserClosedCallWidget && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] font-black text-white items-center justify-center">1</span>
            </span>
          )}
        </button>
      </div>

      {/* Hidden SEO optimization block for Google Crawlers (B2B Commercial, Enterprises, Construction Sites & Alarms) */}
      <section className="sr-only" aria-hidden="true" id="seo-corporate-metadata">
        <h1>{t("Monitoring kamer dla firm, alarmy dla przedsiębiorstw i placów budowy", "Camera monitoring for businesses, corporate alarms and construction sites", "Kamerový monitoring pro firmy, podnikové alarmy a staveniště")}</h1>
        <h2>{t("Profesjonalne instalacje security B2B - Śląsk, Małopolska, Żywiec, Bielsko-Biała, Katowice, Kraków", "Professional B2B security installations - Silesia, Lesser Poland", "Profesionální B2B bezpečnostní instalace - Slezsko, Malopolsko")}</h2>
        
        <div>
          <h3>{t("Monitoring wizyjny CCTV i kamery IP dla firm i korporacji", "CCTV Video Monitoring and IP Cameras for Companies & Corporations", "Kamerové systémy CCTV a IP kamery pro firmy a korporace")}</h3>
          <p>
            {t(
              "Oferujemy najwyższej klasy systemy telewizji przemysłowej (CCTV) oraz zaawansowany monitoring kamer dla firm, biur, korporacji, hal magazynowych, zakładów produkcyjnych oraz centrów logistycznych. Nasze rozwiązania obejmują inteligentne kamery IP o wysokiej rozdzielczości z funkcją detekcji ruchu AI, rozpoznawaniem twarzy oraz rejestracją tablic rejestracyjnych. Gwarantujemy stabilny i bezpieczny podgląd online na urządzeniach mobilnych z dowolnego miejsca na świecie. Obsługujemy duże firmy i przedsiębiorstwa poszukujące bezkompromisowej niezawodności i ochrony mienia.",
              "We offer top-class closed-circuit television (CCTV) systems and advanced camera monitoring for companies, offices, corporations, warehouses, production plants, and logistics centers. Our solutions include high-resolution smart IP cameras with AI motion detection, facial recognition, and license plate reading. We guarantee a stable and secure online preview on mobile devices from anywhere in the world. We serve large companies and enterprises seeking uncompromising reliability and property protection.",
              "Nabízíme špičkové kamerové systémy (CCTV) a pokročilý kamerový monitoring pro firmy, kanceláře, korporace, sklady, výrobní závody a logistická centra. Naše řešení zahrnují chytré IP kamery s vysokým rozlišením, detekcí pohybu AI, rozpoznáváním obličejů a čtením registračních značek. Garantujeme stabilní a bezpečný online náhled na mobilních zařízeních odkudkoli na světě. Obsluhujeme velké společnosti a podniky hledající nekompromisní spolehlivost a ochranu majetku."
            )}
          </p>
        </div>

        <div>
          <h3>{t("Zabezpieczenie i monitoring placów budowy oraz terenów przemysłowych", "Security and Monitoring of Construction Sites and Industrial Areas", "Zabezpečení a monitoring stavenišť a průmyslových areálů")}</h3>
          <p>
            {t(
              "Specjalizujemy się w szybkim i profesjonalnym zabezpieczaniu terenów inwestycyjnych oraz placów budowy. Monitoring placów budowy pozwala na skuteczne zapobieganie kradzieżom materiałów budowlanych, maszyn oraz aktom wandalizmu. Oferujemy bezprzewodowe systemy kamer z zasilaniem solarnym (LTE/WiFi), które nie wymagają stałego przyłącza elektrycznego. Całodobowy nadzór i natychmiastowe alerty o naruszeniu strefy bezpieczeństwa gwarantują pełną ochronę inwestycji budowlanych.",
              "We specialize in rapid and professional security setup for investment areas and construction sites. Construction site monitoring allows for effective prevention of building materials, machinery theft, and vandalism. We offer wireless camera systems with solar power (LTE/WiFi) that do not require a permanent electrical connection. Round-the-clock surveillance and instant security breach alerts guarantee full protection of construction investments.",
              "Specializujeme se na rychlé a profesionální zabezpečení investičních areálů a stavenišť. Monitorování staveniště umožňuje účinnou prevenci krádeží stavebního materiálu, strojů a vandalismu. Nabízíme bezdrátové kamerové systémy se solárním napájením (LTE/WiFi), které nevyžadují trvalé elektrické připojení. Nepřetržitý dohled a okamžitá upozornění na narušení bezpečnosti zaručují plnou ochranu stavebních investic."
            )}
          </p>
        </div>

        <div>
          <h3>{t("Zaawansowane systemy alarmowe dla firm (SSWiN)", "Advanced Alarm Systems for Businesses (SSWiN)", "Pokročilé poplašné systémy pro firmy (SSWiN)")}</h3>
          <p>
            {t(
              "Projektujemy i montujemy certyfikowane systemy alarmowe dla firm, korporacji oraz obiektów handlowo-usługowych. Bezprzewodowe i przewodowe instalacje alarmowe klasy premium skutecznie chronią mienie przedsiębiorstw przed włamaniem, zalaniem oraz pożarem. Integracja z systemami Smart Lock (inteligentne zamki i klamki) umożliwia pełną kontrolę dostępu pracowników oraz rejestrację czasu pracy w biurach i obiektach komercyjnych.",
              "We design and install certified alarm systems for businesses, corporations, and commercial premises. Premium wireless and wired alarm systems effectively protect corporate property against burglary, water damage, and fire. Integration with Smart Lock systems (smart locks and handles) enables full control over employee access and records working hours in offices and commercial facilities.",
              "Navrhujeme a instalujeme certifikované poplašné systémy pro firmy, korporace a obchodní prostory. Prémiové bezdrátové a drátové poplašné instalace účinně chrání firemní majetek před vloupáním, vytopením a požárem. Integrace se systémy Smart Lock (chytré zámky a kliky) umožňuje plnou kontrolu nad přístupem zaměstnanců a eviduje pracovní dobu v kancelářích a komerčních objektech."
            )}
          </p>
        </div>

        <div>
          <h3>{t("Niezawodna sieć WiFi 6 i WiFi 7 dla biznesu i biur", "Reliable WiFi 6 & WiFi 7 Network for Business and Offices", "Spolehlivá WiFi 6 a WiFi 7 síť pro firmy a kanceláře")}</h3>
          <p>
            {t(
              "Wdrażamy profesjonalne instalacje sieci bezprzewodowych DualBand WiFi 6 oraz DualBand WiFi 7 dla biur, hoteli, restauracji oraz dużych obiektów korporacyjnych. Zapewniamy stabilną łączność dla setek urządzeń jednocześnie, bezpieczne sieci gościnne (Guest WiFi) oraz dedykowane zabezpieczenia sieciowe klasy enterprise dla ochrony danych poufnych Twojego biznesu.",
              "We implement professional DualBand WiFi 6 and DualBand WiFi 7 wireless network installations for offices, hotels, restaurants, and large corporate facilities. We provide stable connectivity for hundreds of devices simultaneously, secure guest networks (Guest WiFi), and dedicated enterprise-grade network security to protect your business's confidential data.",
              "Implementujeme profesionální bezdrátové sítě DualBand WiFi 6 a DualBand WiFi 7 pro kanceláře, hotely, restaurace a velké korporátní objekty. Zajišťujeme stabilní konektivitu pro stovky zařízení současně, bezpečné sítě pro hosty (Guest WiFi) a vyhrazené síťové zabezpečení podnikové úrovně pro ochranu důvěrných dat vaší firmy."
            )}
          </p>
        </div>

        <div>
          <h4>Słowa kluczowe SEO dla Google (Wyszukiwanie lokalne i ogólnopolskie):</h4>
          <p>
            monitoring dla firm, kamery przemysłowe, instalacja kamer dla firm, monitoring placu budowy Bielsko-Biała, alarmy dla firm Żywiec, zabezpieczenie budowy Kraków, systemy alarmowe dla korporacji Katowice, ochrona mienia przedsiębiorstw, kamery IP B2B, kontrola dostępu do biura, instalacja alarmu w firmie, bezprzewodowy monitoring magazynu, kamery solarne LTE, profesjonalny montaż monitoringu Śląsk, systemy bezpieczeństwa dla deweloperów, telewizja przemysłowa CCTV Śląsk, inteligentny budynek komercyjny.
          </p>
        </div>
      </section>

      {/* Legal Modal Component */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-zinc-150">
              <div className="flex items-center gap-2">
                <SmartHomeEmblem size={24} />
                <h3 className="text-sm font-black uppercase text-zinc-950 tracking-wider">
                  {activeLegalModal === "regulamin" 
                    ? t("Regulamin świadczenia usług", "Terms of Service", "Obchodní podmínky")
                    : t("Polityka Prywatności i RODO", "Privacy Policy & GDPR", "Zásady ochrany osobních údajů i GDPR")}
                </h3>
              </div>
              <button 
                onClick={() => setActiveLegalModal(null)}
                className="text-zinc-400 hover:text-zinc-900 p-1.5 rounded-full hover:bg-zinc-100 transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto text-xs text-zinc-600 leading-relaxed space-y-4 text-left">
              {activeLegalModal === "regulamin" ? (
                <>
                  {lang === "PL" && (
                    <div className="space-y-4">
                      <p className="font-bold text-zinc-800">REGULAMIN WYCENY I USŁUG INSTALACYJNYCH "TWÓJ SMART HOME"</p>
                      <p>Niniejszy regulamin określa zasady korzystania z konfiguratora, zamawiania bezpłatnej wyceny oraz realizacji usług montażowych przez firmę Dream Studio z siedzibą w Rychwałdzie, ul. Wesoła 25, 34-322 Rychwałd, NIP: 627-264-32-87.</p>
                      
                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">§ 1. Postanowienia ogólne</h4>
                        <ul className="list-disc pl-4 space-y-1 mt-1">
                          <li>Serwis i konfigurator dostępny pod adresem internetowym służy do orientacyjnego wyliczenia kosztów zakupu oraz montażu urządzeń inteligentnego domu.</li>
                          <li>Właścicielem serwisu oraz podmiotem świadczącym usługi jest Dream Studio.</li>
                          <li>Kontakt z Usługodawcą jest możliwy pod adresem e-mail: <strong className="text-zinc-800">dreamstudiopl@gmail.com</strong>.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">§ 2. Wycena i audyt na miejscu</h4>
                        <ul className="list-disc pl-4 space-y-1 mt-1">
                          <li>Wszelkie kalkulacje wygenerowane przez konfigurator mają charakter szacunkowy i informacyjny. Nie stanowią one oferty handlowej w rozumieniu art. 66 § 1 Kodeksu Cywilnego.</li>
                          <li>Zgłoszenie wysłane przez użytkownika za pośrednictwem formularza stanowi zapytanie ofertowe i zaproszenie do bezpłatnego audytu technicznego u klienta.</li>
                          <li>Audyt techniczny na miejscu oraz sporządzenie finalnego kosztorysu są całkowicie darmowe i niezobowiązujące.</li>
                          <li>Ostateczna cena realizacji usługi oraz specyfikacja techniczna są ustalane indywidualnie i zatwierdzane w formie pisemnej umowy przed przystąpieniem do montażu.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">§ 3. Warunki realizacji usług montażowych</h4>
                        <ul className="list-disc pl-4 space-y-1 mt-1">
                          <li>Warunkiem przystąpienia do montażu urządzeń SMART Home jest zapewnienie przez Klienta odpowiednich warunków technicznych (m.in. działające łącze internetowe o odpowiedniej sile sygnału, zasilanie elektryczne w miejscach montażu kamer/zamków).</li>
                          <li>Jeżeli Klient wybierze opcję modernizacji sieci WiFi, montażysta dokona stosownej konfiguracji routerów/punktów dostępowych DualBand WiFi 6 lub WiFi 7 w celu zapewnienia stabilnej łączności urządzeń IoT.</li>
                          <li>Dream Studio gwarantuje, że instalowane urządzenia są fabrycznie nowe, wolne od wad fizycznych i prawnych oraz posiadają gwarancję producenta.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">§ 4. Odpowiedzialność i reklamacje</h4>
                        <ul className="list-disc pl-4 space-y-1 mt-1">
                          <li>Usługodawca dokłada wszelkich starań, aby instalacje przebiegały bezinwazyjnie (bez niepotrzebnych kabli i wiercenia).</li>
                          <li>Ewentualne reklamacje dotyczące działania systemu, urządzeń lub jakości montażu należy zgłaszać bezpośrednio na adres e-mail: <strong className="text-zinc-800">dreamstudiopl@gmail.com</strong>.</li>
                          <li>Reklamacje będą rozpatrywane w ustawowym terminie 14 dni od ich wpłynięcia.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">§ 5. Postanowienia końcowe</h4>
                        <p className="mt-1">W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają odpowiednie przepisy prawa polskiego, w szczególności Kodeksu Cywentnego oraz Ustawy o prawach konsumenta.</p>
                      </div>
                    </div>
                  )}

                  {lang === "ENG" && (
                    <div className="space-y-4">
                      <p className="font-bold text-zinc-800">TERMS OF SERVICE - ESTIMATES & SMART HOME INSTALLATIONS</p>
                      <p>These terms define the rules for using the online configurator, requesting a free quote/audit, and the execution of installation services by Dream Studio based in Rychwałd, ul. Wesoła 25, 34-322 Rychwałd, Poland, NIP: 627-264-32-87.</p>
                      
                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">Section 1. General Provisions</h4>
                        <p>The configurator tool provides non-binding estimates for smart home device purchases and professional installation services. The service provider is Dream Studio, reachable via email at dreamstudiopl@gmail.com.</p>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">Section 2. Non-binding Estimates & On-site Audit</h4>
                        <p>All calculations generated are informational and do not constitute a commercial offer under the Polish Civil Code. Requests trigger a completely free, non-binding on-site technical audit and final customized quote generation.</p>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">Section 3. Implementation</h4>
                        <p>Client must provide basic technical conditions (e.g. electrical power and internet network coverage). If upgraded WiFi standard is purchased, our technicians will configure professional dual-band mesh equipment for seamless operations.</p>
                      </div>
                    </div>
                  )}

                  {lang === "CZ" && (
                    <div className="space-y-4">
                      <p className="font-bold text-zinc-800">VŠEOBECNÉ OBCHODNÍ PODMÍNKY PRO KALKULACI A INSTALACI</p>
                      <p>Tyto podmínky upravují používání konfigurátoru, objednávání bezplatných kalkulací a realizaci montážních služeb společností Dream Studio se sídlem v Rychwałdě, ul. Wesoła 25, 34-322 Rychwałd, Polsko, NIP: 627-264-32-87.</p>
                      
                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">§ 1. Obecná ustanovení</h4>
                        <p>Konfigurátor slouží k orientačnímu výpočtu nákladů na pořízení a montáž chytré domácnosti. Vlastníkem a poskytovatelem služeb je společnost Dream Studio, e-mail: dreamstudiopl@gmail.com.</p>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">§ 2. Bezplatná kalkulace a audit na místě</h4>
                        <p>Všechny výpočty mají pouze informativní charakter. Odeslaná poptávka slouží jako nezávazná žádost o bezplatný technický audit na místě instalace.</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {lang === "PL" && (
                    <div className="space-y-4">
                      <p className="font-bold text-zinc-800">POLITYKA PRYWATNOŚCI I KLAUZULA INFORMACYJNA RODO</p>
                      <p>Dbamy o ochronę Twojej prywatności. Niniejszy dokument opisuje zasady przetwarzania danych osobowych zbieranych za pośrednictwem serwisu i konfiguratora "Twój SMART Home".</p>
                      
                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">1. Administrator Danych Osobowych</h4>
                        <p className="mt-1">Administratorem Twoich danych osobowych jest <strong>Dream Studio</strong>, ul. Wesoła 25, 34-322 Rychwałd, NIP: 627-264-32-87. Możesz się z nami skontaktować pisząc na adres e-mail: <strong>dreamstudiopl@gmail.com</strong>.</p>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">2. Cele i podstawy prawne przetwarzania</h4>
                        <p className="mt-1">Twoje dane osobowe (imię i nazwisko, adres e-mail, numer telefonu oraz adres montażu) są przetwarzane w celach:</p>
                        <ul className="list-disc pl-4 space-y-1 mt-1">
                          <li>Przedstawienia oferty, wykonania darmowego kosztorysu oraz kontaktu w sprawie bezpłatnego audytu (podstawa prawna: art. 6 ust. 1 lit. b RODO – działania przed zawarciem umowy).</li>
                          <li>Realizacji usług montażowych i konfiguracji zakupionych urządzeń (podstawa prawna: art. 6 ust. 1 lit. b RODO – wykonanie umowy).</li>
                          <li>Obsługi zapytań i kontaktu poprzez formularz kontaktowy (podstawa prawna: art. 6 ust. 1 lit. f RODO – prawnie uzasadniony interes administratora).</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">3. Okres przechowywania danych</h4>
                        <p className="mt-1">Dane osobowe będą przetwarzane przez okres niezbędny do przygotowania wyceny, realizacji umowy lub do momentu wniesienia sprzeciwu/żądania ich usunięcia, nie dłużej jednak niż przez okres przedawnienia roszczeń lub okres wynikający z przepisów prawa podatkowego.</p>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">4. Odbiorcy danych i bezpieczeństwo</h4>
                        <p className="mt-1">Twoje dane nie są sprzedawane ani udostępniane podmiotom trzecim w celach marketingowych. Dostęp do nich mają wyłącznie upoważnieni pracownicy i instalatorzy Dream Studio realizujący audyt/montaż na miejscu.</p>
                        <p className="mt-1">Stosujemy zaawansowane techniczne środki bezpieczeństwa w celu zabezpieczenia danych przed niepowołanym dostępem.</p>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">5. Prawa użytkownika</h4>
                        <p className="mt-1">W związku z przetwarzaniem danych osobowych przysługuje Ci prawo do: dostępu do swoich danych, ich sprostowania, usunięcia („prawo do bycia zapomnianym”), ograniczenia ich przetwarzania, przenoszenia danych, wniesienia sprzeciwu wobec przetwarzania oraz wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (PUODO).</p>
                        <p className="mt-1">W celu realizacji swoich praw skontaktuj się z nami pod adresem: <strong>dreamstudiopl@gmail.com</strong>.</p>
                      </div>
                    </div>
                  )}

                  {lang === "ENG" && (
                    <div className="space-y-4">
                      <p className="font-bold text-zinc-800">PRIVACY POLICY & GDPR COMPLIANCE</p>
                      <p>We care about your privacy. This document outlines how your personal data is collected and processed when using our SMART Home Configurator.</p>
                      
                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">1. Data Controller</h4>
                        <p>The controller of your personal data is Dream Studio, ul. Wesoła 25, 34-322 Rychwałd, Poland. Contact: dreamstudiopl@gmail.com.</p>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">2. Purposes of Processing</h4>
                        <p>Your data (name, email, phone, and installation address) is processed for preparing requested estimates, performing technical audits, and executing agreed contracts. This is compliant with Art. 6 (1) (b) of GDPR.</p>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">3. Your Rights</h4>
                        <p>You have the right to access, rectify, or request erasure of your personal data at any time by contacting us.</p>
                      </div>
                    </div>
                  )}

                  {lang === "CZ" && (
                    <div className="space-y-4">
                      <p className="font-bold text-zinc-800">ZÁSADY OCHRANY OSOBNÍCH ÚDAJŮ (GDPR)</p>
                      <p>Zavazujeme se chránit vaše soukromí. Tento dokument popisuje zásady zpracování osobních údajů v rámci konfigurátoru "Twój SMART Home".</p>
                      
                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">1. Správce osobních údajů</h4>
                        <p>Správcem vašich osobních údajů je Dream Studio, ul. Wesoła 25, 34-322 Rychwałd, Polsko. Kontakt: dreamstudiopl@gmail.com.</p>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-zinc-900 uppercase">2. Vaše práva</h4>
                        <p>Máte právo na přístup, opravu nebo vymazání svých osobních údajů. Kdykoli nás kontaktujte na e-mailu dreamstudiopl@gmail.com.</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer buttons */}
            <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-150 flex justify-end">
              <button 
                onClick={() => setActiveLegalModal(null)}
                className="bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                {t("Rozumiem i akceptuję", "I understand & accept", "Rozumím a přijímám")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
