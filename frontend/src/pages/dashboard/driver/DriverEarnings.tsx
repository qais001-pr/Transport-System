import { useContext, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import {
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  Users,
  Navigation,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

//@ts-ignore
import userContext from "../../../context/userContext";
//@ts-ignore
import useEarning from "../../../hooks/drivers/get/useEarning";
//@ts-ignore
import useEarningPerStudent from "../../../hooks/drivers/get/useEarningPerStudent";
//@ts-ignore
import useLatestEarning from "../../../hooks/drivers/get/useLatestEarning";

export default function DriverEarnings() {
  const { user, logOut }: any = useContext(userContext);

  const currentYear = new Date().getFullYear();

  const { data: earningData, isLoading, isError } = useEarning(currentYear);

  const { data: perStudentData } = useEarningPerStudent();

  const normalizedEarnings = useMemo(() => {
    if (!earningData) {
      return {
        monthlyEarnings: [],
        recentTransactions: [],
        stats: [],
      };
    }

    const earnings = Array.isArray(earningData)
      ? earningData
      : earningData.earnings || [];

    const transactions = earningData.transactions || [];

    const getMonthName = (monthStr: string) => {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const match = monthStr?.match(/(\d{4})-(\d{2})/);

      if (match) {
        const monthNum = parseInt(match[2]) - 1;
        return months[monthNum];
      }

      return monthStr;
    };

    const isCurrentMonth = (monthStr: string) => {
      const today = new Date();
      const current = `${today.getFullYear()}-${String(
        today.getMonth() + 1,
      ).padStart(2, "0")}`;

      return monthStr === current;
    };

    const monthlyEarnings = earnings.map((e: any) => ({
      month: getMonthName(e.month),
      amount: parseInt(e.total || e.amount || e.total_earning || 0),
      routes: parseInt(e.route_count || 0),
      students: parseInt(e.child_count || 0),
      avgPerRoute: e.route_count
        ? Math.round(parseInt(e.total || 0) / parseInt(e.route_count))
        : 0,
      current: isCurrentMonth(e.month),
      activeChildCount: parseInt(e.active_child_count || 0),
    }));

    const recentTransactions = transactions.map((t: any) => ({
      id: t.id,
      date: t.date || t.transaction_date,
      description: t.description || `Route ${t.route_name}`,
      amount: parseInt(t.amount || 0),
      status: t.status,
      students: parseInt(t.students || 0),
      routes: parseInt(t.routes || 1),
    }));

    const totalEarned = monthlyEarnings.reduce(
      (sum: number, m: any) => sum + m.amount,
      0,
    );

    const currentMonth = monthlyEarnings.find((m: any) => m.current);

    const avgPerRoute =
      monthlyEarnings.length > 0
        ? Math.round(
            monthlyEarnings.reduce(
              (sum: number, m: any) => sum + m.avgPerRoute,
              0,
            ) / monthlyEarnings.length,
          )
        : 0;

    const stats = [
      {
        title: "This Month",
        value: `Rs.${currentMonth?.amount || 0}`,
        change: "+12%",
        trend: "up",
        icon: DollarSign,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        title: "Total Earned",
        value: `Rs.${totalEarned}`,
        change: "+8%",
        trend: "up",
        icon: TrendingUp,
        color: "text-primary",
        bgColor: "bg-primary-50",
      },
      {
        title: "Avg Per Route",
        value: `Rs.${avgPerRoute}`,
        change: "+5%",
        trend: "up",
        icon: Navigation,
        color: "text-secondary",
        bgColor: "bg-secondary-50",
      },
      {
        title: "Active Students",
        value: `${monthlyEarnings.reduce(
          (sum: number, m: any) => sum + m.activeChildCount,
          0,
        )}`,
        change: "+2",
        trend: "up",
        icon: Users,
        color: "text-highlight",
        bgColor: "bg-highlight-50",
      },
    ];

    return {
      monthlyEarnings,
      recentTransactions,
      stats,
    };
  }, [earningData]);

  const { monthlyEarnings, stats } = normalizedEarnings;

  const studentBreakdown = Array.isArray(perStudentData) ? perStudentData : [];

  const maxAmount =
    monthlyEarnings?.length > 0
      ? Math.max(...monthlyEarnings.map((m: any) => m.amount))
      : 0;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar
        userRole={user?.role || "Guest"}
        userName={user?.full_name || "Guest"}
        userEmail={user?.email || "Guest@gmail.com"}
        logOut={logOut}
      />

      <div className="flex-1">
        <Header
          title="Earnings Report"
          subtitle="Track your income and financial performance"
          role={user?.role || "Guest"}
          profile={user?.profile_photo || "Guest"}
        />

        {isError && (
          <div className="p-6 bg-accent/10 border border-accent text-accent rounded-lg m-6">
            Failed to load earnings data.
          </div>
        )}

        <main className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-neutral-600">Loading earnings data...</p>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats?.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                        >
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>

                        <div className="flex items-center gap-1 text-xs">
                          {stat.trend === "up" ? (
                            <ArrowUpRight className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-accent" />
                          )}
                          <span>{stat.change}</span>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                      <p className="text-sm text-neutral-600">{stat.title}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Chart */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                  <CardDescription>
                    Monthly earnings for {currentYear}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {monthlyEarnings?.map((item: any, index: number) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between text-sm">
                        <span>{item.month}</span>
                        <span>Rs.{item.amount}</span>
                      </div>

                      <div className="w-full bg-neutral-200 h-3 rounded mt-1">
                        <div
                          className="bg-primary h-3 rounded"
                          style={{
                            width: `${
                              maxAmount ? (item.amount / maxAmount) * 100 : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Student Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Student Breakdown</CardTitle>
                </CardHeader>

                <CardContent>
                  {studentBreakdown?.map((student: any, i: number) => (
                    <div key={i} className="flex justify-between p-3 border-b">
                      <div>
                        <p className="font-medium">{student.child_name}</p>
                        <p className="text-sm text-neutral-500">
                          {student.route_name}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span>
                          Rs.
                          {student.amount || student.monthlyFee || student.fee}
                        </span>

                        {student.status === "PAID" ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between pt-4 font-bold">
                    <span>Total Monthly</span>
                    <span>
                      Rs.
                      {studentBreakdown?.reduce(
                        (acc: number, s: any) =>
                          acc + (Number(s.amount) || Number(s.monthlyFee) || 0),
                        0,
                      )}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
