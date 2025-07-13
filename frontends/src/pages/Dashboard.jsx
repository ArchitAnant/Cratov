import StatusCard from "../components/StatusCard";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-white px-8 py-20 pt-28 overflow-y-auto">
      <div className="flex flex-col gap-6">
        <StatusCard
          username="ar1_archit_"
          time="2 days ago"
          address="48, Thakurpukur, Bibirhat - Bakrahat - Raipur Rd"
          status="Awaiting Approval"
          bidStatus=""
          phoneCount="56"
        />
        <StatusCard
          username="ar1_archit_"
          time="2 days ago"
          address="48, Thakurpukur, Bibirhat - Bakrahat - Raipur Rd"
          status="Approved"
          bidStatus="On Bid"
          price="1.50"
        />
      </div>
    </div>
  );
};

export default Dashboard;
