import TodayView from "@/components/TodayView";
export default function TrailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}<TodayView /></>;
}
