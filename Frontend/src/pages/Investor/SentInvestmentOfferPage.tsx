import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  DollarSign,
  Percent,
  Calendar,
  Info,
  SendHorizontal,
  Scale,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";

import { useCreateInvestmentOffer } from "../../hooks/Investor/InvestmentOffer/InvestmentOfferHooks";
import {
  investmentOfferSchema,
  type InvestmentOfferFormValues,
} from "../../lib/validations/investmentOfferSchema";

export default function SendInvestmentOfferPage() {
  const { projectId, pitchId } = useParams();
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateInvestmentOffer();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvestmentOfferFormValues>({
    resolver: zodResolver(investmentOfferSchema),
    defaultValues: {
      amount: undefined,
      equityPercentage: undefined,
      valuation: undefined,
      terms: "",
      note: "",
      expiresAt: "",
    },
  });

  const onSubmit = (data: InvestmentOfferFormValues) => {
    const payload = {
      projectId: projectId!,
      pitchId: pitchId!,
      ...data,
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
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-6"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Create Investment Offer
          </h1>
          <p className="text-slate-500 mt-2">
            Formalize your interest by outlining the financial and legal
            parameters of your investment.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-md ring-1 ring-slate-200">
              <CardHeader className="border-b bg-slate-50/30">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      Financial Breakdown
                    </CardTitle>
                    <CardDescription>Core numbers for the deal</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Investment Amount (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder="500,000"
                        className={`pl-9 ${errors.amount ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        {...register("amount", { valueAsNumber: true })}
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-xs font-medium text-red-500 mt-1">
                        {errors.amount.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="equity">Equity Percentage</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="equity"
                        type="number"
                        step="0.01"
                        placeholder="7.5"
                        className={`pl-9 ${errors.equityPercentage ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        {...register("equityPercentage", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    {errors.equityPercentage && (
                      <p className="text-xs font-medium text-red-500 mt-1">
                        {errors.equityPercentage.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valuation">
                    Company Valuation (Optional)
                  </Label>
                  <Input
                    id="valuation"
                    type="number"
                    placeholder="Post-money valuation"
                    className={errors.valuation ? "border-red-500" : ""}
                    {...register("valuation", { valueAsNumber: true })}
                  />
                  {errors.valuation && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.valuation.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md ring-1 ring-slate-200">
              <CardHeader className="border-b bg-slate-50/30">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      Legal & Structural Terms
                    </CardTitle>
                    <CardDescription>
                      Detail your rights and deal structure
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="terms">Offer Terms</Label>
                  <Textarea
                    id="terms"
                    rows={6}
                    placeholder="Describe board seats, voting rights, liquidation preferences, etc."
                    className={`resize-none ${errors.terms ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    {...register("terms")}
                  />
                  {errors.terms && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.terms.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Secondary Options */}
          <div className="space-y-6">
            <Card className="border-none shadow-md ring-1 ring-slate-200">
              <CardHeader className="bg-slate-900 text-white rounded-t-xl py-4">
                <CardTitle className="text-sm uppercase tracking-wider font-bold">
                  Expiration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Offer Expiry</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="expiresAt"
                      type="date"
                      className="pl-9"
                      {...register("expiresAt")}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight italic">
                    If left blank, the offer will remain open until manually
                    retracted or accepted.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md ring-1 ring-slate-200 bg-blue-50/50">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="note">Personal Note (Optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Add a friendly message to the founder..."
                    className="bg-white"
                    {...register("note")}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                disabled={isPending}
              >
                {isPending ? (
                  "Sending..."
                ) : (
                  <>
                    Send Formal Offer
                    <SendHorizontal className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="flex-1 order-2 sm:order-1 text-slate-500 hover:bg-slate-100"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>

            <div className="p-4 rounded-xl border border-amber-100 bg-amber-50 flex gap-3">
              <Info className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Sending this offer creates a digital record. Ensure all terms
                comply with your regional investment laws.
              </p>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
