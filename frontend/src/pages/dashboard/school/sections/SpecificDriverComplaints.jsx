import { X, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import useSpecificDriverComplaints from "../../../../hooks/schools/get/useSpecificDriverComplaints";
import { Badge } from "@/components/ui/Badge";

const SpecificDriverComplaints = ({ driverId, onClose }) => {
  console.log("driver id", driverId);
  const { data: complaints, isLoading } = useSpecificDriverComplaints(driverId);

  const mappedComplaints =
    complaints?.map((c) => ({
      id: c.id,
      description: c.description,
      parent: c.full_name,
      phone: c.phone,
      student: c.child_name,
      status:
        c.status === "OPEN"
          ? "open"
          : c.status === "RESOLVED"
            ? "resolved"
            : c.status === "REJECTED"
              ? "rejected"
              : "in-progress",
      date: new Date(c.created_at).toLocaleDateString(),
    })) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-neutral-900">
            Driver Complaints
          </h2>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-neutral-100"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[65vh] space-y-4">
          {isLoading && (
            <p className="text-sm text-neutral-500">Loading complaints...</p>
          )}

          {!isLoading && mappedComplaints.length === 0 && (
            <div className="text-center py-10">
              <AlertTriangle className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-600 text-sm">
                No complaints found for this driver
              </p>
            </div>
          )}

          {mappedComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="border rounded-lg p-4 space-y-2 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500">
                  {complaint.date}
                </span>

                <Badge
                  variant={
                    complaint.status === "resolved"
                      ? "success"
                      : complaint.status === "open"
                        ? "danger"
                        : complaint.status === "rejected"
                          ? "destructive"
                          : "warning"
                  }
                  className="capitalize"
                >
                  {complaint.status === "resolved" && (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  )}
                  {complaint.status === "open" && (
                    <AlertTriangle className="w-3 h-3 mr-1" />
                  )}
                  {complaint.status === "in-progress" && (
                    <Clock className="w-3 h-3 mr-1" />
                  )}
                  {complaint.status === "rejected" && (
                    <X className="w-3 h-3 mr-1" />
                  )}

                  {complaint.status}
                </Badge>
              </div>

              <p className="text-sm text-neutral-700">
                {complaint.description}
              </p>

              <div className="text-xs text-neutral-500">
                <p>
                  <strong>Parent:</strong> {complaint.parent}
                </p>
                <p>
                  <strong>Phone:</strong> {complaint.phone}
                </p>
                <p>
                  <strong>Student:</strong> {complaint.student}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecificDriverComplaints;
