import Navbar from "@/components/Navbar";
export default function AuthNavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("refresh");
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
