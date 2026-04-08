import { IGetAdminDashboardGraphUseCase } from "@domain/interfaces/useCases/admin/dashboard/IGetAdminDashboardGraphUseCase";
import { ITransactionRepository } from "@domain/interfaces/repositories/ITransactionRepository";
import { TransactionReason } from "@domain/enum/transactionType";
import { MonthlyRevenueDTO } from "application/dto/admin/monthlyRevenueDTO";

export class GetAdminDashboardGraphUseCase implements IGetAdminDashboardGraphUseCase {
  constructor(private _transactionRepo: ITransactionRepository) {}

  async execute(params: {
    type: "subscription" | "commission";
    year?: number;
    month?: number;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<MonthlyRevenueDTO[]> {
    const { type, year, month, fromDate, toDate } = params;

    let rawData: { _id: number; total: number }[] = [];

    const filter: {
      year?: number;
      month?: number;
      fromDate?: Date;
      toDate?: Date;
    } = {};

    if (year) filter.year = year;
    if (month) filter.month = month;
    if (fromDate) filter.fromDate = fromDate;
    if (toDate) filter.toDate = toDate;

    if (type === "commission") {
      rawData = await this._transactionRepo.getRevenueByReasonWithFilter(
        TransactionReason.PLATFORM_FEE,
        filter
      );
    } else {
      rawData = await this._transactionRepo.getRevenueByReasonWithFilter(
        TransactionReason.SUBSCRIPTION,
        filter
      );
    }

    if (month) {
      return rawData.map((d) => ({
        month: this.getMonthName(d._id),
        amount: d.total,
      }));
    }

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return months.map((m, i) => {
      const found = rawData.find((d) => d._id === i + 1);
      return {
        month: m,
        amount: found ? found.total : 0,
      };
    });
  }

  private getMonthName(month: number): string {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return months[month - 1] ?? "";
  }
}
