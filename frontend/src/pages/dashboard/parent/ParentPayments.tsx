import { useState, useContext } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { usePaymentHistory } from "@/hooks/parents/get/usePaymentHistory";
import { usePayNow } from "@/hooks/parents/usePayNow";
import userContext from "@/context/userContext";
import {
  DollarSign,
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Plus,
  TrendingUp,
  TrendingDown,
  Receipt,
} from "lucide-react";
import { toast } from "react-toastify";

export default function ParentPayments() {
  const [filterYear, setFilterYear] = useState("2025");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const userCtx: any = useContext(userContext);
  const { user, logOut } = userCtx || {};
  const { data: paymentHistoryData, isLoading, isError } = usePaymentHistory();
  const { mutate: payNow, isPending: payLoading } = usePayNow();

  const allPayments: any[] = paymentHistoryData?.payments || [];

  // Calculate stats from actual payment data
  const totalPAID = allPayments
    .filter((p: any) => p?.payment_status === "PAID")
    .reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);

  const PENDINGAmount = allPayments
    .filter((p: any) => p?.payment_status === "PENDING")
    .reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);

  const thisMonthAmount = allPayments
    .filter((p: any) => {
      const paymentDate = new Date(p.due_date || p.dueDate);
      const now = new Date();
      return (
        paymentDate.getMonth() === now.getMonth() &&
        paymentDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);

  const avg =
    allPayments.length > 0 ? totalPAID / Math.max(allPayments.length, 1) : 0;

  const stats = [
    {
      title: "Total PAID",
      value: `Rs.${totalPAID.toFixed(2)}`,
      change: `+${allPayments.filter((p: any) => p?.payment_status === "PAID").length} payments`,
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "PENDING",
      value: `Rs.${PENDINGAmount.toFixed(2)}`,
      change: `${allPayments.filter((p: any) => p?.payment_status === "PENDING").length} invoices`,
      trend: "neutral",
      icon: Clock,
      color: "text-highlight",
      bgColor: "bg-highlight-50",
    },
    {
      title: "This Month",
      value: `Rs.${thisMonthAmount.toFixed(2)}`,
      change: `${allPayments.length} bookings`,
      trend: "neutral",
      icon: Calendar,
      color: "text-secondary",
      bgColor: "bg-secondary-50",
    },
    {
      title: "Avg Monthly",
      value: allPayments.length > 0 ? `Rs.${avg.toFixed(2)}` : "Rs.0.00",
      change: allPayments.length > 0 ? `-Rs.${(avg * 0.1).toFixed(2)}` : "N/A",
      trend: "down",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary-50",
    },
  ];

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    switch (statusLower) {
      case "PAID":
        return "success";
      case "PENDING":
        return "warning";
      case "late":
        return "danger";
      case "overdue":
        return "danger";
      default:
        return "secondary";
    }
  };

  const handleOpenPayment = (payment: any) => {
    setSelectedPayment(payment);
    setPaymentFile(null);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPayment(null);
    setPaymentFile(null);
  };

  const handlePaymentFileChange = (e: any) => {
    const file = e.target.files && e.target.files[0];
    setPaymentFile(file || null);
  };

  const handleSubmitPayment = () => {
    if (!selectedPayment?.id || !paymentFile)
      return toast.error(
        "Please select a payment and upload proof before submitting.",
      );
    const formData = new FormData();
    if (paymentFile) {
      formData.append("proof_photo", paymentFile);
    }
    payNow(
      { id: selectedPayment.id, data: formData },
      {
        onSuccess: () => {
          closePaymentModal();
        },
      },
    );
  };

  // Format payment data for display
  const payments = allPayments.map((p: any) => ({
    id: p.id || p.invoice_id || "N/A",
    month:
      p.month ||
      new Date(p.due_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      }),
    amount: parseFloat(p.amount) || 0,
    dueDate: new Date(p.due_date).toLocaleDateString() || "N/A",
    paymentDate: p.payment_date || null,
    status: p?.payment_status || "PENDING",
    children:
      p.children && Array.isArray(p.children)
        ? p.children.map((child: any) => child.full_name || "Unknown")
        : [],
    driverName: p.driver_name || "N/A",
    vanNumber: p.van_number || "N/A",
    paymentMethod: p.payment_method || null,
    transactionId: p.transaction_id || null,
    lateFee: p.late_fee || 0,
  }));

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar
        userRole={user?.role || "parent"}
        userName={user?.full_name || "User"}
        userEmail={user?.email || "user@example.com"}
        logOut={logOut || (() => {})}
      />

      <div className="flex-1">
        <Header
          title="Payments"
          subtitle="Manage your payments and billing information"
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <span className="ml-4 text-neutral-600">
                Loading payment history...
              </span>
            </div>
          )}

          {isError && (
            <Card className="border-2 border-accent mb-6">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-accent mx-auto mb-4" />
                <p className="text-neutral-600">
                  Failed to load payment history. Please try again later.
                </p>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {!isLoading && !isError && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <Card key={index} hover>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                        >
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          {stat.trend === "up" && (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          )}
                          {stat.trend === "down" && (
                            <TrendingDown className="w-4 h-4 text-accent" />
                          )}
                          <span
                            className={
                              stat.trend === "up"
                                ? "text-green-600"
                                : stat.trend === "down"
                                  ? "text-accent"
                                  : "text-neutral-600"
                            }
                          >
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                        {stat.value}
                      </h3>
                      <p className="text-sm text-neutral-600">{stat.title}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Payment History */}
                <div className="lg:col-span-2 space-y-6">
                  {/* PENDING Payments */}
                  {payments.filter((p: any) => p?.status === "PENDING").length >
                    0 && (
                    <Card className="border-2 border-highlight">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-highlight" />
                              PENDING Payments
                            </CardTitle>
                            <CardDescription>
                              Action required - Pay before due date
                            </CardDescription>
                          </div>
                          {/* <Button variant="primary">
                            <DollarSign className="w-4 h-4" />
                            Pay All
                          </Button> */}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {payments
                            .filter((p: any) => p?.status === "PENDING")
                            .map((payment: any) => (
                              <div
                                key={payment.id}
                                className="p-4 bg-highlight-50 rounded-lg border border-highlight-200"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h4 className="font-semibold text-neutral-900">
                                      {payment.month}
                                    </h4>
                                    <p className="text-sm text-neutral-600">
                                      Due: {payment.dueDate}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-neutral-900">
                                      Rs.{payment.amount.toFixed(2)}
                                    </p>
                                    <Badge variant="warning" className="mt-1">
                                      <Clock className="w-3 h-3" />
                                      PENDING
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {payment.children &&
                                  payment.children.length > 0 ? (
                                    payment.children.map(
                                      (child: string, idx: number) => (
                                        <Badge
                                          key={idx}
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {child}
                                        </Badge>
                                      ),
                                    )
                                  ) : (
                                    <span className="text-sm text-neutral-600">
                                      No children linked
                                    </span>
                                  )}
                                </div>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => handleOpenPayment(payment)}
                                >
                                  <CreditCard className="w-4 h-4" />
                                  Pay Rs.{payment.amount.toFixed(2)}
                                </Button>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Payment History */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Payment History</CardTitle>
                          <CardDescription>
                            View all your past transactions
                          </CardDescription>
                        </div>
                        {/* <select
                          value={filterYear}
                          onChange={(e) => setFilterYear(e.target.value)}
                          className="px-3 py-2 rounded-lg border-2 border-neutral-300 focus:border-primary focus:outline-none text-sm"
                        >
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                        </select> */}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {payments && payments.length > 0 ? (
                          payments.map((payment: any) => (
                            <div
                              key={payment.id}
                              className="p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-semibold text-neutral-900">
                                      INVOICE-{payment.id}
                                    </h4>
                                    <Badge
                                      variant={getStatusColor(payment.status)}
                                    >
                                      {payment.status === "PAID" && (
                                        <CheckCircle className="w-3 h-3" />
                                      )}
                                      {payment.status === "PENDING" && (
                                        <Clock className="w-3 h-3" />
                                      )}
                                      {payment.status === "late" && (
                                        <AlertTriangle className="w-3 h-3" />
                                      )}
                                      {payment.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-neutral-600 mb-2">
                                    {payment.month}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {payment.children &&
                                    payment.children.length > 0 ? (
                                      payment.children.map(
                                        (child: string, idx: number) => (
                                          <span
                                            key={idx}
                                            className="text-xs text-neutral-600"
                                          >
                                            {child}
                                          </span>
                                        ),
                                      )
                                    ) : (
                                      <span className="text-xs text-neutral-500">
                                        No children linked
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-neutral-900">
                                    Rs.{payment.amount.toFixed(2)}
                                    {payment.lateFee > 0 && (
                                      <span className="text-sm text-accent ml-1">
                                        (+Rs.{payment.lateFee.toFixed(2)})
                                      </span>
                                    )}
                                  </p>
                                  {payment.paymentDate && (
                                    <p className="text-xs text-neutral-500 mt-1">
                                      Paid:{" "}
                                      {new Date(
                                        payment.paymentDate,
                                      ).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {payment.paymentMethod && (
                                <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                                    <CreditCard className="w-4 h-4" />
                                    <span>{payment.paymentMethod}</span>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Download className="w-4 h-4" />
                                    Receipt
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                            <p className="text-neutral-600">
                              No payment history available
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* Payment Methods */}
                  {/* <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Payment Methods</CardTitle>
                        <Button variant="ghost" size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-4 rounded-lg border-2 border-primary bg-primary-50">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-neutral-200">
                                <CreditCard className="w-5 h-5 text-neutral-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-neutral-900">
                                  Visa
                                </p>
                                <p className="text-sm text-neutral-600">
                                  **** 4242
                                </p>
                              </div>
                            </div>
                            <Badge variant="primary" className="text-xs">
                              Default
                            </Badge>
                          </div>
                          <p className="text-xs text-neutral-500">
                            Expires: 12/26
                          </p>
                        </div>
                        <p className="text-sm text-neutral-600">
                          No payment methods available
                        </p>
                      </div>
                    </CardContent>
                  </Card> */}

                  {/* Quick Actions */}
                  {/* <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Receipt className="w-4 h-4" />
                          Download All Receipts
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Calendar className="w-4 h-4" />
                          Set Auto-Pay
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Download className="w-4 h-4" />
                          Export Statement
                        </Button>
                      </div>
                    </CardContent>
                  </Card> */}

                  {/* Payment Summary */}
                  <Card className="bg-gradient-to-br from-primary to-secondary text-white">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Payment Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">Total PAID</span>
                          <span className="text-xl font-bold">
                            Rs.{totalPAID.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">PENDING</span>
                          <span className="text-xl font-bold">
                            Rs.{PENDINGAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="pt-3 border-t border-white/20">
                          <div className="flex items-center justify-between">
                            <span className="text-white/80">Total</span>
                            <span className="text-2xl font-bold">
                              Rs.{(totalPAID + PENDINGAmount).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </main>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-neutral-900">
                    Make Payment
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={closePaymentModal}
                    disabled={payLoading}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-neutral-600">Payment ID</p>
                    <p className="font-semibold text-neutral-900">
                      #{selectedPayment?.id || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral-600">Child Name</p>
                    <p className="font-semibold text-neutral-900">
                      {selectedPayment?.children?.[0] || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral-600">Amount</p>
                    <p className="font-bold text-lg text-secondary">
                      Rs.{selectedPayment?.amount?.toFixed(2) || "0.00"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-neutral-700 mb-2">
                      Upload Payment Proof *
                    </label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handlePaymentFileChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                    />
                    {paymentFile && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ {paymentFile.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={closePaymentModal}
                    disabled={payLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={handleSubmitPayment}
                    disabled={payLoading}
                  >
                    {payLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2 inline-block"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4 mr-2" />
                        Pay Now
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
