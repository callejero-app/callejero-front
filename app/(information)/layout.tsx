import NavbarInfo from "@/components/NavbarInfo/NavbarInfo";
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
