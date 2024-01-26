import NavbarInfo from "@/components/NavbarInfo";
export default function infoNavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavbarInfo />
      {children}
    </div>
  );
}
