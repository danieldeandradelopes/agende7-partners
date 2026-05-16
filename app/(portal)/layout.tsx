import PartnerShell from "@/components/PartnerShell";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PartnerShell>{children}</PartnerShell>;
}
