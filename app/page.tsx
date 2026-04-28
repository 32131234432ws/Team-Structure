import { devPods, crossFunctionalTeams, hypercarePods } from "@/lib/team-data";
import { ReleaseSection } from "@/components/release-section";
import { StatsHeader } from "@/components/stats-header";
import { CrossFunctionalSection } from "@/components/cross-functional-section";
import { LeadershipSection } from "@/components/leadership-section";
import { SitUatSection } from "@/components/sit-uat-section";
import { HypercareSection } from "@/components/hypercare-section";
import { InternsSection } from "@/components/interns-section";

export default function Home() {
  const ir32Pods = devPods.filter((pod) => pod.release === "IR3.2");
  const ir33Pods = devPods.filter((pod) => pod.release === "IR3.3");
  const ir4Pods = devPods.filter((pod) => pod.release === "IR4");
  const ir32HypercarePods = hypercarePods.filter((pod) => pod.release === "IR3.2-Hypercare");

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Team Structure
          </h1>
          <p className="text-muted-foreground mb-4">
            Dev Pods, Value Streams & Planned Staffing Hierarchy
          </p>
          <StatsHeader />
        </header>

        {/* Leadership & Cross-Functional Section */}
        <LeadershipSection defaultOpen={false} />

        {/* Cross-Functional PODs Section */}
        <CrossFunctionalSection teams={crossFunctionalTeams} defaultOpen={false} />

        {/* Interns Section */}
        <InternsSection defaultOpen={false} />

        {/* Release Sections */}
        <div className="space-y-10">
          {/* IR3.2 Hypercare Section */}
          {ir32HypercarePods.length > 0 && (
            <HypercareSection
              title="IR3.2 Hypercare"
              pods={ir32HypercarePods}
              badgeColor="bg-green-500/20 text-green-400 border-green-500/30"
              defaultOpen={true}
            />
          )}

          {/* IR3.2 SIT Section */}
          <ReleaseSection
            title="IR3.2"
            phase="SIT"
            pods={ir32Pods}
            badgeColor="bg-blue-500/20 text-blue-400 border-blue-500/30"
            phaseColor="bg-blue-500/20 text-blue-400 border-blue-500/30"
            defaultOpen={true}
          />

          {/* SIT/UAT Execution Team for IR3.2 */}
          <SitUatSection defaultOpen={true} />

          <ReleaseSection
            title="IR3.3"
            phase="Planning"
            pods={ir33Pods}
            badgeColor="bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
            phaseColor="bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
            defaultOpen={true}
          />

          <ReleaseSection
            title="IR4"
            phase="Development"
            pods={ir4Pods}
            badgeColor="bg-amber-500/20 text-amber-400 border-amber-500/30"
            phaseColor="bg-amber-500/20 text-amber-400 border-amber-500/30"
            defaultOpen={true}
          />
        </div>
      </div>
    </main>
  );
}
