import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Background from "@/components/layout/Background";
import LogInput from "@/components/analysis/LogInput";
import InvestigationTimeline from "@/components/analysis/InvestigationTimeline";
import RecentInvestigations from "@/components/history/RecentInvestigations";

export default function Home() {
  return (
    <Background>
      <Navbar />

      <main className="page-container min-h-[calc(100vh-64px)] py-8">
        <section className="workspace-section overflow-hidden">
          <div className="workspace-header">
            <div>
              <p className="muted-label">Investigation Workspace</p>
              <h1 className="text-2xl font-semibold">
                Analyze CI/CD Pipeline Failures
              </h1>
            </div>
          </div>

          <div className="grid gap-6 p-6 xl:grid-cols-[2fr_1fr]">
            <LogInput />
            <InvestigationTimeline />
          </div>
        </section>

        <section id="analysis-report" />

        <RecentInvestigations />
      </main>

      <Footer />
    </Background>
  );
}
