import React, { useState } from "react";
import { useDashboard } from "./dashboard-context";
import {
  Gift,
  ArrowRight,
  Copy,
  Check,
  Send,
  Sparkles,
  Users,
  Wallet,
  Heart,
  Share2,
} from "lucide-react";

export function AfterPartyWrap() {
  const { lang, expenseTransfers, eventName } = useDashboard();
  const [copiedNote, setCopiedNote] = useState<string | null>(null);

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const thankYouTemplates = [
    {
      id: "elders",
      title: "Respected Elders & Extended Grandparents",
      titleHi: "आदरणीय बुजुर्ग और वरिष्ठ परिजन",
      text: `प्रणाम आदरणीय,\n\n${eventName} में आपकी उपस्थिति और मंगलकारी आशीर्वाद ने हमारे इस पावन प्रसंग को पूर्णता प्रदान की। आपके चरण स्पर्श और आशीर्वचनों के लिए हम हृदय से कृतज्ञ हैं।\n\n- सादर चरण स्पर्श, पूरा सेहरा परिवार।`,
    },
    {
      id: "friends",
      title: "College & Squad Friends",
      titleHi: "कॉलेज दोस्त और गैंग",
      text: `Hey fam! ❤️\n\nThank you so much for bringing that insane energy to the Sangeet and reception! The dance floor wouldn't have been legendary without you guys rocking the DJ till the last beat. Can't wait to share the raw 4K party reels!\n\nCheers & big hugs! Aarav & Meera.`,
    },
    {
      id: "family",
      title: "Immediate Family & Cousins Committee",
      titleHi: "निकट परिजन और चचेरे भाई-बहन",
      text: `प्यारे परिवारजन,\n\nपिछले 3 महीनों से लेकर शादी के आखरी विदाई पल तक आपके अथक सहयोग, व्यवस्था और प्यार के बिना यह भव्य उत्सव संभव नहीं था। यह जीत हम सबकी है!\n\nस्नेह और प्यार सहित,\nआरव व मीरा।`,
    },
  ];

  const handleCopyNote = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNote(id);
    setTimeout(() => setCopiedNote(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
            <Gift className="size-3.5" />
            <span>
              {lang === "hi"
                ? "कार्यक्रम समाप्ति व हिसाब-किताब"
                : "Post-Event Settlements & Thanks"}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {lang === "hi"
              ? "साझा खर्च का हिसाब व धन्यवाद संदेश"
              : "Split Shared Costs & Thank You Notes"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {lang === "hi"
              ? "परिवार में किसने क्या खर्च किया, उसका आसान हिसाब और रिश्तेदारों व दोस्तों को भेजने के लिए तैयार व्हाट्सएप संदेश।"
              : "Easily see who owes what among family members with simple settlements, and copy ready-made thank you messages to send on WhatsApp."}
          </p>
          <p className="text-sm text-muted-foreground">
            {lang === "hi"
              ? "साझा पारिवारिक खर्चों को न्यूनतम लेन-देन के साथ संतुलित करने वाला गणितीय एल्गोरिदम। बुजुर्गों, मित्रों और परिजनों के लिए विशेष व्हाट्सएप धन्यवाद टेम्पलेट्स।"
              : "Graph-optimized minimum cash transfer solver reducing shared family debts to the fewest peer-to-peer transfers, plus tailored gratitude templates."}
          </p>
        </div>
      </div>

      {/* Minimum Cash Transfer Solver Grid */}
      <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Wallet className="size-4 text-primary" />
              <span>
                {lang === "hi" ? "न्यूनतम नकद अंतरण सॉल्वर" : "Minimum Cash Transfer Settlement"}
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Total shared ledger: ₹7,00,000. Resolved into just 3 simplified transfers.
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            0 Remaining Balance
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {expenseTransfers.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl border bg-muted/40 p-4 space-y-2 hover:border-primary/40 transition"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Transfer #{idx + 1}</span>
                <span className="font-mono font-bold text-primary text-sm">{inr(t.amount)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground pt-1">
                <span className="truncate">{t.from}</span>
                <ArrowRight className="size-4 text-primary shrink-0" />
                <span className="truncate text-emerald-600 dark:text-emerald-400">{t.to}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group-Specific WhatsApp Thank-You Templates */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          <Heart className="size-4 text-rose-500 fill-rose-500" />
          <span>
            {lang === "hi"
              ? "समूह-विशिष्ट धन्यवाद टेम्पलेट्स"
              : "Group-Specific WhatsApp Thank-You Notes"}
          </span>
        </h3>

        <div className="grid gap-6 md:grid-cols-3">
          {thankYouTemplates.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-3xl border bg-card p-6 shadow-sm space-y-4"
            >
              <div className="space-y-2">
                <h4 className="font-display text-base font-bold text-foreground">
                  {lang === "hi" ? item.titleHi : item.title}
                </h4>
                <div className="rounded-2xl border bg-muted/30 p-3.5 text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {item.text}
                </div>
              </div>

              <button
                onClick={() => handleCopyNote(item.id, item.text)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border bg-muted/50 py-2.5 text-xs font-bold text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
              >
                {copiedNote === item.id ? (
                  <Check className="size-4 text-emerald-500" />
                ) : (
                  <Copy className="size-4" />
                )}
                <span>{copiedNote === item.id ? "Copied Note!" : "Copy WhatsApp Template"}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
