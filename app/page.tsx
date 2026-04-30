import { devPods, crossFunctionalTeams, hypercarePods, sitUatExecutionTeam } from "@/lib/team-data";
import { ReleaseSection } from "@/components/release-section";
import { StatsHeader } from "@/components/stats-header";
import { CrossFunctionalSection } from "@/components/cross-functional-section";
import { LeadershipSection } from "@/components/leadership-section";
import { CombinedReleaseSection } from "@/components/combined-release-section";
import { TeamPageTabs } from "@/components/team-page-tabs";
import { DetailedTeamView } from "@/components/detailed-team-view";

export default function Home() {
  const ir32Pods = devPods.filter((pod) => pod.release === "IR3.2");
  const ir33Pods = devPods.filter((pod) => pod.release === "IR3.3");
  const ir4Pods = devPods.filter((pod) => pod.release === "IR4");
  const ir32HypercarePods = hypercarePods.filter((pod) => pod.release === "IR3.2-Hypercare");

  const structureView = (
    <>
      {/* Leadership & Cross-Functional Section */}
      <LeadershipSection defaultOpen={false} />

      {/* Cross-Functional PODs Section */}
      <CrossFunctionalSection teams={crossFunctionalTeams} defaultOpen={false} />

      {/* Release Sections */}
      <div className="space-y-10">
        {/* IR3.2 with sub-sections */}
        <CombinedReleaseSection
          title="IR3.2"
          phase="SIT"
          devPods={ir32Pods}
          hypercarePods={ir32HypercarePods}
          sitUatTeam={sitUatExecutionTeam}
          badgeColor="bg-blue-500/20 text-blue-400 border-blue-500/30"
          phaseColor="bg-blue-500/20 text-blue-400 border-blue-500/30"
          defaultOpen={true}
        />

        <ReleaseSection
          title="3.X (Outage)"
          phase="Planning"
          pods={ir33Pods}
          badgeColor="bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
          phaseColor="bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
          defaultOpen={true}
        />

        {/* IR4 with sub-sections */}
        <CombinedReleaseSection
          title="IR4"
          phase="Development"
          devPods={ir4Pods}
          badgeColor="bg-amber-500/20 text-amber-400 border-amber-500/30"
          phaseColor="bg-amber-500/20 text-amber-400 border-amber-500/30"
          defaultOpen={true}
        />
      </div>
    </>
  );

  const detailedView = <DetailedTeamView />;

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

        {/* Tabbed Content */}
        <TeamPageTabs
          structureView={structureView}
          detailedView={detailedView}
        />
      </div>
    </main>
  );
}
