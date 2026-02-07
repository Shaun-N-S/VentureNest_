import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { useCreateInvestmentOffer } from "../../hooks/Investor/InvestmentOffer/InvestmentOfferHooks";
import { investmentOfferSchema, type InvestmentOfferFormValues } from "../../lib/validations/investmentOfferSchema";

export default function SendInvestmentOfferPage() {
  const { projectId, pitchId } = useParams();
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateInvestmentOffer();

  const [form, setForm] = useState({
    amount: "",
    equityPercentage: "",
    valuation: "",
    terms: "",
    note: "",
    expiresAt: "",
  });

  const handleSubmit = () => {
    const parsed = investmentOfferSchema.safeParse({
      amount: Number(form.amount),
      equityPercentage: Number(form.equityPercentage),
      valuation: form.valuation ? Number(form.valuation) : undefined,
      terms: form.terms,
      note: form.note || undefined,
      expiresAt: form.expiresAt || undefined,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    const payload: InvestmentOfferFormValues & {
      projectId: string;
      pitchId: string;
    } = {
      projectId: projectId!,
      pitchId: pitchId!,
      ...parsed.data,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Investment offer sent successfully");
        navigate("/investor/offers");
      },
      onError: () => {
        toast.error("Failed to send investment offer");
      },
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Send Investment Offer</CardTitle>
            <p className="text-sm text-muted-foreground">
              Define your investment terms clearly before sending
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* ===== Financial Terms ===== */}
            <section className="space-y-4">
              <h3 className="font-semibold text-lg">Financial Terms</h3>

              <Input
                type="number"
                placeholder="Investment Amount (USD)"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />

              <Input
                type="number"
                placeholder="Equity Percentage (%)"
                value={form.equityPercentage}
                onChange={(e) =>
                  setForm({
                    ...form,
                    equityPercentage: e.target.value,
                  })
                }
              />

              <Input
                type="number"
                placeholder="Valuation (optional)"
                value={form.valuation}
                onChange={(e) =>
                  setForm({ ...form, valuation: e.target.value })
                }
              />
            </section>

            {/* ===== Terms ===== */}
            <section className="space-y-4">
              <h3 className="font-semibold text-lg">Investment Terms</h3>

              <Textarea
                rows={5}
                placeholder="Describe equity structure, expectations, rights, etc."
                value={form.terms}
                onChange={(e) => setForm({ ...form, terms: e.target.value })}
              />
            </section>

            {/* ===== Optional ===== */}
            <section className="space-y-4">
              <h3 className="font-semibold text-lg">Optional Details</h3>

              <Textarea
                rows={3}
                placeholder="Optional note to founder"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />

              <Input
                type="date"
                value={form.expiresAt}
                onChange={(e) =>
                  setForm({ ...form, expiresAt: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Offer expiry date (optional)
              </p>
            </section>

            {/* ===== Actions ===== */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isPending}>
                Send Offer
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
