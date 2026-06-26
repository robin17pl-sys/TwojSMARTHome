import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  Trash2,
  Edit,
  Download,
  PlusCircle,
  Database,
  TrendingUp,
  Briefcase,
  FileText,
  Clock,
  PhoneCall,
  Mail,
  MapPin,
  X,
  Check,
  CheckCircle2,
  ArrowLeft,
  Lock,
  User,
  Activity,
  AlertCircle,
  LogOut
} from "lucide-react";
import { CRMOrder, CRMInquiry } from "../App";

interface CrmDashboardProps {
  crmOrders: CRMOrder[];
  crmInquiries: CRMInquiry[];
  updateCrmOrders: (orders: CRMOrder[]) => void;
  updateCrmInquiries: (inquiries: CRMInquiry[]) => void;
  onBackToHome: () => void;
}

export default function CrmDashboard({
  crmOrders,
  crmInquiries,
  updateCrmOrders,
  updateCrmInquiries,
  onBackToHome
}: CrmDashboardProps) {
  // Authentication Gate
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(() => {
    return localStorage.getItem("crm_authenticated") === "true";
  });
  const [authError, setAuthError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin" || password === "admin123" || password === "dream2026") {
      setIsAuth(true);
      setAuthError("");
      localStorage.setItem("crm_authenticated", "true");
    } else {
      setAuthError("Nieprawidłowy klucz dostępu administratora!");
    }
  };

  const handleLogout = () => {
    setIsAuth(false);
    localStorage.removeItem("crm_authenticated");
  };

  // State managers
  const [activeTab, setActiveTab] = useState<"orders" | "inquiries" | "tools">("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "in_progress" | "completed" | "cancelled">("all");
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "price-desc" | "price-asc">("date-desc");

  // Notes state
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotesText, setTempNotesText] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormType, setAddFormType] = useState<"order" | "inquiry">("order");
  
  // Manual Add Form State - General
  const [addFullname, setAddFullname] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addAddress, setAddAddress] = useState("");
  const [addNotes, setAddNotes] = useState("");
  const [addTotalPrice, setAddTotalPrice] = useState("1500");
  const [addInquiryMessage, setAddInquiryMessage] = useState("");

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ type: "order" | "inquiry"; id: string } | null>(null);
  const [editFullname, setEditFullname] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editTotalPrice, setEditTotalPrice] = useState(0);
  const [editMessage, setEditMessage] = useState("");
  const [editStatus, setEditStatus] = useState<"new" | "in_progress" | "completed" | "cancelled">("new");

  // Notification Banner
  const [bannerMsg, setBannerMsg] = useState("");

  const triggerBanner = (msg: string) => {
    setBannerMsg(msg);
    setTimeout(() => {
      setBannerMsg("");
    }, 4000);
  };

  // Status Colors & Badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Nowy
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            W realizacji
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Zrealizowano
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            Anulowano
          </span>
        );
      default:
        return null;
    }
  };

  // Calculations
  const activeOrders = crmOrders.filter(o => o.status !== "cancelled");
  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.finalTotalPrice, 0);
  const completedOrders = crmOrders.filter(o => o.status === "completed");
  const completedRevenue = completedOrders.reduce((sum, o) => sum + o.finalTotalPrice, 0);
  
  const statusCounts = {
    new: crmOrders.filter(o => o.status === "new").length + crmInquiries.filter(i => i.status === "new").length,
    in_progress: crmOrders.filter(o => o.status === "in_progress").length + crmInquiries.filter(i => i.status === "in_progress").length,
    completed: crmOrders.filter(o => o.status === "completed").length + crmInquiries.filter(i => i.status === "completed").length,
    cancelled: crmOrders.filter(o => o.status === "cancelled").length + crmInquiries.filter(i => i.status === "cancelled").length,
  };

  // Notes update
  const handleSaveNotes = (id: string, type: "order" | "inquiry") => {
    if (type === "order") {
      const updated = crmOrders.map(o => o.id === id ? { ...o, notes: tempNotesText } : o);
      updateCrmOrders(updated);
    } else {
      const updated = crmInquiries.map(i => i.id === id ? { ...i, notes: tempNotesText } : i);
      updateCrmInquiries(updated);
    }
    setEditingNotesId(null);
    triggerBanner("Notatki administratora zostały pomyślnie zaktualizowane.");
  };

  // Quick Status change
  const handleQuickStatusChange = (id: string, type: "order" | "inquiry", newStatus: any) => {
    if (type === "order") {
      const updated = crmOrders.map(o => o.id === id ? { ...o, status: newStatus } : o);
      updateCrmOrders(updated);
    } else {
      const updated = crmInquiries.map(i => i.id === id ? { ...i, status: newStatus } : i);
      updateCrmInquiries(updated);
    }
    triggerBanner(`Status zgłoszenia ${id} zmieniony na: ${newStatus === "in_progress" ? "W realizacji" : newStatus === "completed" ? "Zrealizowano" : newStatus === "cancelled" ? "Anulowano" : "Nowy"}`);
  };

  // Delete Customer
  const handleDeleteItem = (id: string, type: "order" | "inquiry") => {
    if (confirm(`Czy na pewno chcesz usunąć klienta ${id} z bazy danych CRM? Operacja jest nieodwracalna.`)) {
      if (type === "order") {
        updateCrmOrders(crmOrders.filter(o => o.id !== id));
      } else {
        updateCrmInquiries(crmInquiries.filter(i => i.id !== id));
      }
      triggerBanner(`Usunięto rekord ${id} z bazy danych CRM.`);
    }
  };

  // Export database to JSON
  const handleExportData = () => {
    const dataStr = JSON.stringify({ orders: crmOrders, inquiries: crmInquiries }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `SMART_CRM_EXPORT_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    triggerBanner("Wyeksportowano bazę danych do pliku JSON.");
  };

  // Reset database to Seeds
  const handleResetDatabase = () => {
    if (confirm("Czy chcesz zresetować bazę danych CRM i przywrócić fabryczne dane demonstracyjne? Wszystkie nowe wpisy zostaną usunięte.")) {
      const SEED_CRM_ORDERS = [
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
          status: "in_progress" as const,
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
          status: "new" as const,
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
          status: "completed" as const,
          notes: "Montaż wykonany bez problemów. Klientka zachwycona funkcją otwierania drzwi smartfonem oraz kodami dostępu dla ekipy remontowej. Opłacone gotówką."
        }
      ];

      const SEED_CRM_INQUIRIES = [
        {
          id: "INQ-481920",
          date: "26.06.2026",
          name: "Tomasz Mazur (Mazur Logistics Sp. z o.o.)",
          email: "t.mazur@mazur-logistics.pl",
          phone: "501 234 567",
          message: "Dzień dobry, poszukujemy profesjonalnego rozwiązania do monitorowania nowo powstającego centrum logistycznego w Katowicach (hala 4000m2 + parking zewnętrzny). Interesuje nas monitoring kamer IP z detekcją AI oraz system alarmowy połączony z kontrolą dostępu na klamki Smart. Proszę o kontakt w celu umówienia darmowego audytu na miejscu.",
          status: "new" as const,
          notes: "Potencjalnie bardzo duży klient korporacyjny. Zadzwonić pilnie w poniedziałek rano i zaproponować spotkanie z darmowym audytem mienia."
        },
        {
          id: "INQ-294012",
          date: "23.06.2026",
          name: "Katarzyna Wiśniewska",
          email: "k.wisniewska@gmail.com",
          phone: "602 987 654",
          message: "Chciałabym zabezpieczyć swój dom jednorodzinny w Żywcu. Zależy mi na 3 kamerach zewnętrznych oraz czujnikach zalania/dymu w kotłowni i kuchni. Czy montaż jest całkowicie bezinwazyjny? Ile czasu trwa instalacja i czy nauczą mnie Państwo obsługi aplikacji na telefonie?",
          status: "in_progress" as const,
          notes: "Rozmawiałem telefonicznie. Klientka obawia się wiercenia. Przekonana o bezprzewodowości i darmowej aplikacji. Montaż zaplanowany wstępnie na czwartek za tydzień."
        },
        {
          id: "INQ-182930",
          date: "18.06.2026",
          name: "Piotr Woźniak (Woźniak Developer)",
          email: "biuro@wozniak-developer.pl",
          phone: "733 445 556",
          message: "Szukam firmy do stałej współpracy przy zabezpieczaniu placów budowy na terenie Małopolski i Śląska. Obecnie startujemy z 3 nowymi osiedlami w Krakowie i Bielsku. Potrzebujemy stabilnego monitoringu kamer LTE na zasilaniu solarnym. Proszę o przesłanie cennika B2B.",
          status: "completed" as const,
          notes: "Nawiązano stałą współpracę. Pierwsze osiedle już monitorowane i zabezpieczone (kamery obrotowe + alarm dymu). Płatności na czas, super kontakt."
        }
      ];

      updateCrmOrders(SEED_CRM_ORDERS);
      updateCrmInquiries(SEED_CRM_INQUIRIES);
      triggerBanner("Przywrócono fabryczną bazę danych CRM.");
    }
  };

  // Add Manual Entry Handler
  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFullname.trim() || !addEmail.trim()) {
      alert("Imię/Nazwisko oraz E-mail są obowiązkowe!");
      return;
    }

    if (addFormType === "order") {
      const newOrder: CRMOrder = {
        id: "SMART-" + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString("pl-PL"),
        fullname: addFullname,
        email: addEmail,
        phone: addPhone,
        address: addAddress || "Zgłoszenie telefoniczne",
        itemsOrdered: [
          { name: "Ręcznie dodana konfiguracja / usługa B2B", qty: 1, price: parseInt(addTotalPrice) || 1500 }
        ],
        finalTotalPrice: parseInt(addTotalPrice) || 1500,
        status: "new",
        notes: addNotes || "Wpis utworzony ręcznie przez administratora CRM."
      };
      updateCrmOrders([newOrder, ...crmOrders]);
      triggerBanner(`Ręcznie dodano klienta usługi: ${addFullname}`);
    } else {
      const newInq: CRMInquiry = {
        id: "INQ-" + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString("pl-PL"),
        name: addFullname,
        email: addEmail,
        phone: addPhone || undefined,
        message: addInquiryMessage || "Klient pytał telefonicznie o wycenę security.",
        status: "new",
        notes: addNotes || "Zapytanie dodane ręcznie przez administratora."
      };
      updateCrmInquiries([newInq, ...crmInquiries]);
      triggerBanner(`Ręcznie dodano zapytanie ofertowe od: ${addFullname}`);
    }

    // Reset Form Fields
    setAddFullname("");
    setAddEmail("");
    setAddPhone("");
    setAddAddress("");
    setAddNotes("");
    setAddTotalPrice("1500");
    setAddInquiryMessage("");
    setIsAddModalOpen(false);
  };

  // Open Edit Modal
  const openEditModal = (item: { type: "order" | "inquiry"; id: string }) => {
    setEditingItem(item);
    if (item.type === "order") {
      const order = crmOrders.find(o => o.id === item.id);
      if (order) {
        setEditFullname(order.fullname);
        setEditEmail(order.email);
        setEditPhone(order.phone);
        setEditAddress(order.address);
        setEditNotes(order.notes || "");
        setEditTotalPrice(order.finalTotalPrice);
        setEditStatus(order.status);
      }
    } else {
      const inq = crmInquiries.find(i => i.id === item.id);
      if (inq) {
        setEditFullname(inq.name);
        setEditEmail(inq.email);
        setEditPhone(inq.phone || "");
        setEditAddress("");
        setEditNotes(inq.notes || "");
        setEditMessage(inq.message);
        setEditStatus(inq.status);
      }
    }
    setIsEditModalOpen(true);
  };

  // Save Edits Handler
  const handleSaveEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (editingItem.type === "order") {
      const updated = crmOrders.map(o => {
        if (o.id === editingItem.id) {
          return {
            ...o,
            fullname: editFullname,
            email: editEmail,
            phone: editPhone,
            address: editAddress,
            finalTotalPrice: editTotalPrice,
            status: editStatus,
            notes: editNotes
          };
        }
        return o;
      });
      updateCrmOrders(updated);
      triggerBanner(`Zaktualizowano dane klienta usługi: ${editingItem.id}`);
    } else {
      const updated = crmInquiries.map(i => {
        if (i.id === editingItem.id) {
          return {
            ...i,
            name: editFullname,
            email: editEmail,
            phone: editPhone || undefined,
            message: editMessage,
            status: editStatus,
            notes: editNotes
          };
        }
        return i;
      });
      updateCrmInquiries(updated);
      triggerBanner(`Zaktualizowano zapytanie ofertowe: ${editingItem.id}`);
    }
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  // Filter & Search Logic
  const filteredOrders = crmOrders
    .filter(order => {
      const matchSearch =
        order.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phone.includes(searchQuery) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || order.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date-desc") return b.date.localeCompare(a.date);
      if (sortBy === "date-asc") return a.date.localeCompare(b.date);
      if (sortBy === "price-desc") return b.finalTotalPrice - a.finalTotalPrice;
      if (sortBy === "price-asc") return a.finalTotalPrice - b.finalTotalPrice;
      return 0;
    });

  const filteredInquiries = crmInquiries
    .filter(inq => {
      const matchSearch =
        inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inq.phone && inq.phone.includes(searchQuery)) ||
        inq.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || inq.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date-desc") return b.date.localeCompare(a.date);
      if (sortBy === "date-asc") return a.date.localeCompare(b.date);
      return 0;
    });

  // Render Login state first
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden font-sans select-none">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-[100px]" />

        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative z-10 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-zinc-850 flex items-center justify-center border border-zinc-750">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
          </div>

          <div className="text-center space-y-2 mb-8">
            <h1 className="text-xl font-extrabold text-zinc-100 tracking-tight">Twój SMART Home & Business</h1>
            <p className="text-xs text-zinc-400 uppercase tracking-widest font-mono">Panel Bezpieczeństwa CRM</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Klucz dostępu administratora (PIN)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Wpisz np. admin"
                  className="w-full bg-zinc-850 border border-zinc-750 rounded-xl py-3 px-10 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              </div>
              {authError && (
                <p className="text-[11px] text-red-400 font-medium mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Zaloguj do CRM</span>
            </button>

            <button
              type="button"
              onClick={onBackToHome}
              className="w-full py-3 px-6 bg-transparent hover:bg-zinc-850 text-zinc-400 font-bold rounded-xl text-xs uppercase tracking-wider transition-all border border-zinc-800 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Wróć do strony głównej</span>
            </button>
          </form>

          <p className="text-[10px] text-zinc-600 text-center mt-8">
            Dostęp chroniony. System CRM przeznaczony wyłącznie dla zespołu Dream Studio. Służy do obsługi konfiguracji monitoringu, systemów alarmowych dla firm oraz placów budowy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans leading-relaxed flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="bg-zinc-900 border-b border-zinc-800 text-zinc-100 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm tracking-tight text-white leading-none">Twój SMART Home & Business</h1>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">B2B CRM</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5 leading-none">Panel Zarządzania Klientami i Zapytaniami Ofertowymi</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Dodaj klienta</span>
            </button>

            <button
              onClick={onBackToHome}
              className="bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700 text-xs font-bold py-2 px-4 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Strona Główna</span>
            </button>

            <button
              onClick={handleLogout}
              className="text-zinc-400 hover:text-white transition-colors text-xs p-2 ml-1"
              title="Wyloguj się"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Success Notification Banner */}
      {bannerMsg && (
        <div className="bg-emerald-600 text-white text-xs font-bold py-3.5 px-6 shadow-xl sticky top-[73px] z-30 flex items-center justify-between gap-4 border-b border-emerald-700 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
            <p>{bannerMsg}</p>
          </div>
          <button onClick={() => setBannerMsg("")} className="hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Metrics Dashboard Overview */}
      <section className="bg-zinc-900 text-zinc-100 py-8 border-b border-zinc-800 shadow-inner">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            
            <div className="bg-zinc-850 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-4 right-4 text-emerald-500 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/10">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Szacowany Przychód</span>
              <div className="mt-4">
                <span className="text-2xl md:text-3xl font-black text-white">{totalRevenue.toLocaleString("pl-PL")} zł</span>
                <p className="text-[10px] text-zinc-400 mt-1">Suma aktywnych konfiguracji</p>
              </div>
            </div>

            <div className="bg-zinc-850 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-4 right-4 text-amber-500 bg-amber-500/10 p-2 rounded-xl border border-amber-500/10">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Złożone Zamówienia</span>
              <div className="mt-4">
                <span className="text-2xl md:text-3xl font-black text-white">{crmOrders.length}</span>
                <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                  <span>{completedRevenue.toLocaleString("pl-PL")} zł</span> zrealizowane
                </p>
              </div>
            </div>

            <div className="bg-zinc-850 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-4 right-4 text-blue-500 bg-blue-500/10 p-2 rounded-xl border border-blue-500/10">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Zapytania Ofertowe</span>
              <div className="mt-4">
                <span className="text-2xl md:text-3xl font-black text-white">{crmInquiries.length}</span>
                <p className="text-[10px] text-zinc-400 mt-1">Zgłoszenia z formularza kontaktowego</p>
              </div>
            </div>

            <div className="bg-zinc-850 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-4 right-4 text-zinc-400 bg-zinc-800 p-2 rounded-xl border border-zinc-700">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Status Zgłoszeń</span>
              <div className="grid grid-cols-2 gap-x-2 mt-4 text-[11px]">
                <div className="flex justify-between border-b border-zinc-800 py-1 font-mono text-zinc-300">
                  <span>Nowe:</span> <strong className="text-amber-400">{statusCounts.new}</strong>
                </div>
                <div className="flex justify-between border-b border-zinc-800 py-1 font-mono text-zinc-300">
                  <span>W toku:</span> <strong className="text-blue-400">{statusCounts.in_progress}</strong>
                </div>
                <div className="flex justify-between py-1 font-mono text-zinc-300">
                  <span>Wykonane:</span> <strong className="text-emerald-400">{statusCounts.completed}</strong>
                </div>
                <div className="flex justify-between py-1 font-mono text-zinc-300">
                  <span>Anulowane:</span> <strong className="text-zinc-500">{statusCounts.cancelled}</strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main CRM Workspace Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column Controls / Filters - Grid 3 */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Section: Search & Filters */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wider border-b border-zinc-100 pb-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              Narzędzia Filtrowania
            </h3>

            {/* Search Input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Wyszukaj</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Imię, email, telefon, ID..."
                  className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-2 px-3 pl-9 text-xs focus:outline-none focus:border-zinc-500"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2.5 text-zinc-450 hover:text-zinc-900">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Status</label>
              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-zinc-500"
              >
                <option value="all">Wszystkie statusy</option>
                <option value="new">Nowe (New)</option>
                <option value="in_progress">W realizacji (In Progress)</option>
                <option value="completed">Zrealizowane (Completed)</option>
                <option value="cancelled">Anulowane (Cancelled)</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Sortowanie</label>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-zinc-500"
              >
                <option value="date-desc">Od najnowszych</option>
                <option value="date-asc">Od najstarszych</option>
                {activeTab === "orders" && (
                  <>
                    <option value="price-desc">Cena: najwyższa</option>
                    <option value="price-asc">Cena: najniższa</option>
                  </>
                )}
              </select>
            </div>

          </div>

          {/* Section: B2B Navigation Tabs */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-1.5">
            <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wider border-b border-zinc-100 pb-2 mb-3">
              Grupy Klientów
            </h3>
            
            <button
              onClick={() => { setActiveTab("orders"); setStatusFilter("all"); }}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${activeTab === "orders" ? "bg-zinc-950 text-white shadow-md" : "hover:bg-zinc-50 text-zinc-600"}`}
            >
              <span>🛒 Klienci z Zakupem</span>
              <span className={`font-mono text-[10px] py-0.5 px-2 rounded-full ${activeTab === "orders" ? "bg-zinc-800 text-zinc-200" : "bg-zinc-100 text-zinc-600"}`}>{crmOrders.length}</span>
            </button>

            <button
              onClick={() => { setActiveTab("inquiries"); setStatusFilter("all"); }}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${activeTab === "inquiries" ? "bg-zinc-950 text-white shadow-md" : "hover:bg-zinc-50 text-zinc-600"}`}
            >
              <span>✉️ Klienci z Zapytaniem</span>
              <span className={`font-mono text-[10px] py-0.5 px-2 rounded-full ${activeTab === "inquiries" ? "bg-zinc-800 text-zinc-200" : "bg-zinc-100 text-zinc-600"}`}>{crmInquiries.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("tools")}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${activeTab === "tools" ? "bg-zinc-950 text-white shadow-md" : "hover:bg-zinc-50 text-zinc-600"}`}
            >
              <Database className="w-4 h-4 text-amber-500" />
              <span>Narzędzia i Kopia</span>
            </button>
          </div>

        </div>

        {/* Right Column Content - Grid 9 */}
        <div className="md:col-span-9 space-y-6">
          
          {/* Dynamic header title based on Tab */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
            <div>
              <h2 className="text-base font-black text-zinc-950 uppercase tracking-tight">
                {activeTab === "orders" && "Baza Klientów, którzy kupili usługę i skonfigurowali zestaw"}
                {activeTab === "inquiries" && "Klienci, którzy wysłali zapytania przez formularz kontaktowy"}
                {activeTab === "tools" && "Kopia zapasowa i administracyjne zarządzanie bazą danych"}
              </h2>
              <p className="text-[11px] text-zinc-400 mt-1">
                {activeTab === "orders" && `Znaleziono: ${filteredOrders.length} klientów (na bazie ${crmOrders.length} wszystkich)`}
                {activeTab === "inquiries" && `Znaleziono: ${filteredInquiries.length} zapytań (na bazie ${crmInquiries.length} wszystkich)`}
                {activeTab === "tools" && "Narzędzia konserwacyjne dla bazy danych smart-home"}
              </p>
            </div>
          </div>

          {/* Render Tab Content: Orders */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center text-zinc-500">
                  <Activity className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                  <p className="text-sm font-bold">Brak klientów spełniających kryteria wyszukiwania.</p>
                  <p className="text-xs text-zinc-400 mt-1">Zmień filtry lub spróbuj wpisać inne słowo kluczowe.</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row relative">
                    
                    {/* Left Accent Bar based on status */}
                    <div className={`w-1.5 md:h-auto shrink-0 ${order.status === "new" ? "bg-amber-500" : order.status === "in_progress" ? "bg-blue-500" : order.status === "completed" ? "bg-emerald-500" : "bg-zinc-400"}`} />

                    <div className="p-6 flex-1 space-y-4">
                      {/* Top bar details */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-black text-xs text-zinc-950 bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200">
                            {order.id}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {order.date}
                          </span>
                        </div>
                        
                        {/* Status badge */}
                        <div className="flex items-center gap-2">
                          {getStatusBadge(order.status)}
                        </div>
                      </div>

                      {/* Main client data and selected kit */}
                      <div className="grid md:grid-cols-12 gap-6">
                        
                        {/* Contact details */}
                        <div className="md:col-span-5 space-y-2.5">
                          <h4 className="text-xs font-black uppercase text-zinc-900 tracking-wider flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-zinc-400" />
                            Dane Kontaktowe
                          </h4>
                          <p className="font-bold text-zinc-950 text-sm">{order.fullname}</p>
                          
                          <div className="space-y-1 text-xs text-zinc-600">
                            <p className="flex items-center gap-2">
                              <PhoneCall className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                              <a href={`tel:${order.phone}`} className="hover:underline hover:text-zinc-950">{order.phone}</a>
                            </p>
                            <p className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                              <a href={`mailto:${order.email}`} className="hover:underline hover:text-zinc-950">{order.email}</a>
                            </p>
                            <p className="flex items-start gap-2">
                              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                              <span>{order.address}</span>
                            </p>
                          </div>
                        </div>

                        {/* Selected configuration & price */}
                        <div className="md:col-span-7 space-y-2">
                          <h4 className="text-xs font-black uppercase text-zinc-900 tracking-wider flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                            Skonfigurowany Zestaw SMART
                          </h4>
                          
                          <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-3 max-h-36 overflow-y-auto space-y-1 text-xs font-mono">
                            {order.itemsOrdered.map((item, idx) => (
                              <div key={idx} className="flex justify-between border-b border-zinc-100 py-1 last:border-0 text-zinc-600">
                                <span>• {item.name} <span className="font-bold text-zinc-800">x{item.qty}</span></span>
                                <span className="font-bold text-zinc-900 shrink-0">+{item.price} zł</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-2 font-bold text-sm">
                            <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Wartość szacunkowa z montażem:</span>
                            <span className="text-zinc-950 font-black font-mono text-base">{order.finalTotalPrice} zł</span>
                          </div>
                        </div>

                      </div>

                      {/* Notes / Comments Section */}
                      <div className="bg-amber-500/[0.04] border border-amber-200/50 rounded-xl p-4 mt-2">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-amber-600" />
                            Wewnętrzne notatki administratora / status montażu:
                          </span>
                          {editingNotesId !== order.id ? (
                            <button
                              onClick={() => { setEditingNotesId(order.id); setTempNotesText(order.notes || ""); }}
                              className="text-[10px] font-extrabold uppercase text-amber-700 hover:text-amber-900 cursor-pointer"
                            >
                              Edytuj
                            </button>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveNotes(order.id, "order")}
                                className="text-[10px] font-extrabold uppercase text-emerald-700 hover:text-emerald-900 cursor-pointer"
                              >
                                Zapisz
                              </button>
                              <button
                                onClick={() => setEditingNotesId(null)}
                                className="text-[10px] font-extrabold uppercase text-zinc-500 hover:text-zinc-700 cursor-pointer"
                              >
                                Anuluj
                              </button>
                            </div>
                          )}
                        </div>

                        {editingNotesId === order.id ? (
                          <textarea
                            value={tempNotesText}
                            onChange={(e) => setTempNotesText(e.target.value)}
                            placeholder="Wpisz np. 'Ustalono termin montażu na wtorek rano...'"
                            className="w-full bg-white border border-zinc-250 rounded-xl p-2.5 text-xs focus:outline-none focus:border-zinc-500 text-zinc-800 min-h-[60px]"
                          />
                        ) : (
                          <p className="text-xs text-zinc-700 italic leading-relaxed">
                            {order.notes || "Brak notatek. Kliknij Edytuj aby zapisać uwagi, status darmowego audytu u klienta lub ustalony termin."}
                          </p>
                        )}
                      </div>

                      {/* Admin Quick Status and Action Panel */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-100">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Zmień status:</span>
                          <div className="flex rounded-lg overflow-hidden border border-zinc-200 text-[10px] font-bold uppercase tracking-wider">
                            <button
                              onClick={() => handleQuickStatusChange(order.id, "order", "new")}
                              className={`px-2.5 py-1.5 transition-colors cursor-pointer border-r border-zinc-200 ${order.status === "new" ? "bg-amber-100 text-amber-800" : "bg-white hover:bg-zinc-50 text-zinc-600"}`}
                            >
                              Nowy
                            </button>
                            <button
                              onClick={() => handleQuickStatusChange(order.id, "order", "in_progress")}
                              className={`px-2.5 py-1.5 transition-colors cursor-pointer border-r border-zinc-200 ${order.status === "in_progress" ? "bg-blue-100 text-blue-800" : "bg-white hover:bg-zinc-50 text-zinc-600"}`}
                            >
                              W toku
                            </button>
                            <button
                              onClick={() => handleQuickStatusChange(order.id, "order", "completed")}
                              className={`px-2.5 py-1.5 transition-colors cursor-pointer border-r border-zinc-200 ${order.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-white hover:bg-zinc-50 text-zinc-600"}`}
                            >
                              Gotowe
                            </button>
                            <button
                              onClick={() => handleQuickStatusChange(order.id, "order", "cancelled")}
                              className={`px-2.5 py-1.5 transition-colors cursor-pointer ${order.status === "cancelled" ? "bg-zinc-100 text-zinc-600" : "bg-white hover:bg-zinc-50 text-zinc-500"}`}
                            >
                              Anuluj
                            </button>
                          </div>
                        </div>

                        {/* Edit and delete controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal({ type: "order", id: order.id })}
                            className="p-2 text-zinc-450 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-all cursor-pointer border border-transparent hover:border-zinc-200"
                            title="Edytuj dane klienta"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(order.id, "order")}
                            className="p-2 text-zinc-455 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer border border-transparent hover:border-red-100"
                            title="Usuń wpis z bazy"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Render Tab Content: Inquiries */}
          {activeTab === "inquiries" && (
            <div className="space-y-4">
              {filteredInquiries.length === 0 ? (
                <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center text-zinc-500">
                  <Mail className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                  <p className="text-sm font-bold">Brak zapytań spełniających kryteria wyszukiwania.</p>
                  <p className="text-xs text-zinc-400 mt-1">Zmień filtry lub spróbuj wpisać inne słowo kluczowe.</p>
                </div>
              ) : (
                filteredInquiries.map((inq) => (
                  <div key={inq.id} className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row relative">
                    
                    {/* Left Accent Bar based on status */}
                    <div className={`w-1.5 md:h-auto shrink-0 ${inq.status === "new" ? "bg-amber-500" : inq.status === "in_progress" ? "bg-blue-500" : inq.status === "completed" ? "bg-emerald-500" : "bg-zinc-400"}`} />

                    <div className="p-6 flex-1 space-y-4">
                      {/* Top bar details */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-black text-xs text-zinc-950 bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200">
                            {inq.id}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {inq.date}
                          </span>
                        </div>
                        
                        {/* Status badge */}
                        <div className="flex items-center gap-2">
                          {getStatusBadge(inq.status)}
                        </div>
                      </div>

                      {/* Main client data and message */}
                      <div className="grid md:grid-cols-12 gap-6">
                        
                        {/* Contact details */}
                        <div className="md:col-span-5 space-y-2.5">
                          <h4 className="text-xs font-black uppercase text-zinc-900 tracking-wider flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-zinc-400" />
                            Zgłaszający klient
                          </h4>
                          <p className="font-bold text-zinc-950 text-sm">{inq.name}</p>
                          
                          <div className="space-y-1 text-xs text-zinc-600">
                            {inq.phone && (
                              <p className="flex items-center gap-2">
                                <PhoneCall className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                <a href={`tel:${inq.phone}`} className="hover:underline hover:text-zinc-950">{inq.phone}</a>
                              </p>
                            )}
                            <p className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                              <a href={`mailto:${inq.email}`} className="hover:underline hover:text-zinc-950">{inq.email}</a>
                            </p>
                          </div>
                        </div>

                        {/* Customer Message */}
                        <div className="md:col-span-7 space-y-2">
                          <h4 className="text-xs font-black uppercase text-zinc-900 tracking-wider flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-zinc-400" />
                            Treść zapytania / wiadomość
                          </h4>
                          
                          <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-4 text-xs text-zinc-700 leading-relaxed whitespace-pre-wrap max-h-44 overflow-y-auto">
                            "{inq.message}"
                          </div>
                        </div>

                      </div>

                      {/* Notes / Comments Section */}
                      <div className="bg-amber-500/[0.04] border border-amber-200/50 rounded-xl p-4 mt-2">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-amber-600" />
                            Notatki i uwagi administratora CRM:
                          </span>
                          {editingNotesId !== inq.id ? (
                            <button
                              onClick={() => { setEditingNotesId(inq.id); setTempNotesText(inq.notes || ""); }}
                              className="text-[10px] font-extrabold uppercase text-amber-700 hover:text-amber-900 cursor-pointer"
                            >
                              Edytuj
                            </button>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveNotes(inq.id, "inquiry")}
                                className="text-[10px] font-extrabold uppercase text-emerald-700 hover:text-emerald-900 cursor-pointer"
                              >
                                Zapisz
                              </button>
                              <button
                                onClick={() => setEditingNotesId(null)}
                                className="text-[10px] font-extrabold uppercase text-zinc-500 hover:text-zinc-700 cursor-pointer"
                              >
                                Anuluj
                              </button>
                            </div>
                          )}
                        </div>

                        {editingNotesId === inq.id ? (
                          <textarea
                            value={tempNotesText}
                            onChange={(e) => setTempNotesText(e.target.value)}
                            placeholder="Wpisz np. 'Klient szuka zabezpieczenia placu budowy od zaraz...'"
                            className="w-full bg-white border border-zinc-250 rounded-xl p-2.5 text-xs focus:outline-none focus:border-zinc-500 text-zinc-800 min-h-[60px]"
                          />
                        ) : (
                          <p className="text-xs text-zinc-700 italic leading-relaxed">
                            {inq.notes || "Brak notatek. Kliknij Edytuj aby zapisać uwagi z rozmowy telefonicznej lub postęp oferty."}
                          </p>
                        )}
                      </div>

                      {/* Admin Quick Status and Action Panel */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-100">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Zmień status:</span>
                          <div className="flex rounded-lg overflow-hidden border border-zinc-200 text-[10px] font-bold uppercase tracking-wider">
                            <button
                              onClick={() => handleQuickStatusChange(inq.id, "inquiry", "new")}
                              className={`px-2.5 py-1.5 transition-colors cursor-pointer border-r border-zinc-200 ${inq.status === "new" ? "bg-amber-100 text-amber-800" : "bg-white hover:bg-zinc-50 text-zinc-600"}`}
                            >
                              Nowy
                            </button>
                            <button
                              onClick={() => handleQuickStatusChange(inq.id, "inquiry", "in_progress")}
                              className={`px-2.5 py-1.5 transition-colors cursor-pointer border-r border-zinc-200 ${inq.status === "in_progress" ? "bg-blue-100 text-blue-800" : "bg-white hover:bg-zinc-50 text-zinc-600"}`}
                            >
                              W toku
                            </button>
                            <button
                              onClick={() => handleQuickStatusChange(inq.id, "inquiry", "completed")}
                              className={`px-2.5 py-1.5 transition-colors cursor-pointer border-r border-zinc-200 ${inq.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-white hover:bg-zinc-50 text-zinc-600"}`}
                            >
                              Gotowe
                            </button>
                            <button
                              onClick={() => handleQuickStatusChange(inq.id, "inquiry", "cancelled")}
                              className={`px-2.5 py-1.5 transition-colors cursor-pointer ${inq.status === "cancelled" ? "bg-zinc-100 text-zinc-600" : "bg-white hover:bg-zinc-50 text-zinc-500"}`}
                            >
                              Anuluj
                            </button>
                          </div>
                        </div>

                        {/* Edit and delete controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal({ type: "inquiry", id: inq.id })}
                            className="p-2 text-zinc-450 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-all cursor-pointer border border-transparent hover:border-zinc-200"
                            title="Edytuj dane zapytania"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(inq.id, "inquiry")}
                            className="p-2 text-zinc-455 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer border border-transparent hover:border-red-100"
                            title="Usuń wpis z bazy"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Render Tab Content: Tools & Backups */}
          {activeTab === "tools" && (
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="text-sm font-black uppercase text-zinc-900 tracking-wider border-b border-zinc-100 pb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-500" />
                Konserwacja i Narzędzia Bazy Danych
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Export Card */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase text-zinc-900 tracking-wider">Eksport Danych</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Pobierz kopię zapasową bazy danych</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Kliknięcie wygeneruje i pobierze plik <strong className="text-zinc-900">.json</strong> zawierający pełną listę klientów, skonfigurowanych zestawów, zamówień i zapytań wraz z zapisanymi komentarzami administratora.
                  </p>
                  <button
                    onClick={handleExportData}
                    className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Pobierz plik kopii zapasowej
                  </button>
                </div>

                {/* Reset / Clean database */}
                <div className="bg-amber-50/20 border border-amber-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-200 flex items-center justify-center text-amber-700">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase text-zinc-900 tracking-wider">Przywracanie Bazy</h4>
                      <p className="text-[11px] text-amber-600 mt-0.5">Zresetuj dane do stanu fabrycznego</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Opcja usuwa wszystkie aktualne dane z pamięci przeglądarki i zastępuje je oryginalnymi danymi demonstracyjnymi (3 demonstracyjnych klientów z zestawem + 3 zapytania ofertowe). Przydatne do pokazania działania CRM.
                  </p>
                  <button
                    onClick={handleResetDatabase}
                    className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Przywróć dane demonstracyjne
                  </button>
                </div>

              </div>

              <div className="border-t border-zinc-100 pt-6 space-y-3">
                <h4 className="text-xs font-bold uppercase text-zinc-900 tracking-wider">Informacje o systemie CRM</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Baza danych CRM oparta jest na technologii <strong className="text-zinc-900 font-semibold">Web Storage API (localStorage)</strong>. Dane przechowywane są w sposób bezinwazyjny w bezpiecznym kontenerze Twojej przeglądarki. Oznacza to, że dane nie znikną po odświeżeniu strony ani zamknięciu przeglądarki. Nowe zamówienia skonfigurowane przez klientów ze strony głównej oraz zapytania wysłane przez formularz kontaktowy pojawią się tutaj automatycznie w czasie rzeczywistym!
                </p>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-zinc-900 text-zinc-500 text-xs py-8 border-t border-zinc-800 text-center">
        <p className="max-w-6xl mx-auto px-6">
          System zarządzania relacjami z klientem (CRM) • © 2026 Dream Studio • Panel Administratora
        </p>
      </footer>

      {/* MODAL: MANUAL ADD CUSTOMER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-zinc-250 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-zinc-950 uppercase tracking-tight mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-zinc-900" />
              Ręczne dodawanie klienta do bazy CRM
            </h3>

            {/* Selector: Order vs Inquiry */}
            <div className="grid grid-cols-2 gap-2 mb-6 border border-zinc-200 rounded-xl p-1 bg-zinc-50">
              <button
                type="button"
                onClick={() => setAddFormType("order")}
                className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer ${addFormType === "order" ? "bg-white text-zinc-950 shadow-sm border border-zinc-200/50" : "text-zinc-500 hover:text-zinc-900"}`}
              >
                Klient z zakupem
              </button>
              <button
                type="button"
                onClick={() => setAddFormType("inquiry")}
                className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer ${addFormType === "inquiry" ? "bg-white text-zinc-950 shadow-sm border border-zinc-200/50" : "text-zinc-500 hover:text-zinc-900"}`}
              >
                Klient z zapytaniem
              </button>
            </div>

            <form onSubmit={handleManualAdd} className="space-y-4">
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Imię i nazwisko / Nazwa firmy *</label>
                <input
                  type="text"
                  required
                  value={addFullname}
                  onChange={(e) => setAddFullname(e.target.value)}
                  placeholder="np. Jan Kowalski (Kowalski Sp. z o.o.)"
                  className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-zinc-500 text-zinc-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">E-mail *</label>
                  <input
                    type="email"
                    required
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    placeholder="np. kowalski@gmail.com"
                    className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-zinc-500 text-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Telefon</label>
                  <input
                    type="text"
                    value={addPhone}
                    onChange={(e) => setAddPhone(e.target.value)}
                    placeholder="np. 602 123 456"
                    className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-zinc-500 text-zinc-900"
                  />
                </div>
              </div>

              {addFormType === "order" ? (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Adres instalacji</label>
                    <input
                      type="text"
                      value={addAddress}
                      onChange={(e) => setAddAddress(e.target.value)}
                      placeholder="Ulica, kod pocztowy, miasto"
                      className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-zinc-500 text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Szacowana Wycena (PLN) *</label>
                    <input
                      type="number"
                      required
                      value={addTotalPrice}
                      onChange={(e) => setAddTotalPrice(e.target.value)}
                      placeholder="np. 2500"
                      className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-zinc-500 text-zinc-900 font-mono"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Treść pytania / zgłoszenia</label>
                  <textarea
                    value={addInquiryMessage}
                    onChange={(e) => setAddInquiryMessage(e.target.value)}
                    placeholder="Wpisz treść pytania lub uwagi z rozmowy telefonicznej..."
                    className="w-full bg-zinc-50 border border-zinc-250 rounded-xl p-3 text-xs focus:outline-none focus:border-zinc-500 text-zinc-900 min-h-[90px]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Wewnętrzne notatki (widoczne tylko dla admina)</label>
                <textarea
                  value={addNotes}
                  onChange={(e) => setAddNotes(e.target.value)}
                  placeholder="Notatki o ustaleniach, terminie, specyfice terenu (np. plac budowy, duża korporacja)..."
                  className="w-full bg-zinc-50 border border-zinc-250 rounded-xl p-3 text-xs focus:outline-none focus:border-zinc-500 text-zinc-900 min-h-[70px]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer"
                >
                  Dodaj klienta do CRM
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-3 px-6 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-zinc-250"
                >
                  Anuluj
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CUSTOMER DETAILS */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-zinc-250 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => { setIsEditModalOpen(false); setEditingItem(null); }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-zinc-950 uppercase tracking-tight mb-4 flex items-center gap-2">
              <Edit className="w-5 h-5 text-zinc-900" />
              Edycja rekordu w bazie CRM ({editingItem.id})
            </h3>

            <form onSubmit={handleSaveEdits} className="space-y-4">
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Imię i nazwisko / Firma</label>
                <input
                  type="text"
                  required
                  value={editFullname}
                  onChange={(e) => setEditFullname(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-zinc-500 text-zinc-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">E-mail</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-zinc-500 text-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Telefon</label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-zinc-500 text-zinc-900"
                  />
                </div>
              </div>

              {editingItem.type === "order" ? (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Adres instalacji</label>
                    <input
                      type="text"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-zinc-500 text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Wartość szacunkowa z montażem (zł)</label>
                    <input
                      type="number"
                      required
                      value={editTotalPrice}
                      onChange={(e) => setEditTotalPrice(parseInt(e.target.value) || 0)}
                      className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-zinc-500 text-zinc-900 font-mono font-bold"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Treść zapytania</label>
                  <textarea
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-250 rounded-xl p-3 text-xs focus:outline-none focus:border-zinc-500 text-zinc-900 min-h-[90px]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Status rekordu</label>
                  <select
                    value={editStatus}
                    onChange={(e: any) => setEditStatus(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-zinc-500 text-zinc-900 font-bold"
                  >
                    <option value="new">Nowy (New)</option>
                    <option value="in_progress">W realizacji (In progress)</option>
                    <option value="completed">Zrealizowano (Completed)</option>
                    <option value="cancelled">Anulowano (Cancelled)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Notatki / Postępy ustaleń</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-250 rounded-xl p-3 text-xs focus:outline-none focus:border-zinc-500 text-zinc-900 min-h-[80px]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer"
                >
                  Zapisz zmiany w CRM
                </button>
                <button
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setEditingItem(null); }}
                  className="py-3 px-6 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-zinc-250"
                >
                  Anuluj
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
