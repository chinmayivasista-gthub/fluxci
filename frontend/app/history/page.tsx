import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Background from "@/components/layout/Background";
import HistoryTable from "@/components/history/HistoryTable";

export default function HistoryPage() {
  return (
    <Background>
      <Navbar />

      <main className="page-container min-h-[calc(100vh-64px)] py-8">
        <section className="workspace-section overflow-hidden">
          <div className="workspace-header">
            <div>
              <p className="muted-label">Investigation Browser</p>

              <h1 className="text-2xl font-semibold">
                Investigation History
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Search, browse and inspect previous CI/CD failure analyses.
              </p>
            </div>
          </div>

          <div className="workspace-content">
            <HistoryTable />
          </div>
        </section>
      </main>

      <Footer />
    </Background>
  );
}