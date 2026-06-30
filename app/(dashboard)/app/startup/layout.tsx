'use client';

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  AssessmentResult, 
  RoadmapPhase, 
  Task, 
  DocumentInfo, 
  AchievementBadge, 
  Message,
  TaskStatus
} from "./-types";
import { StartupContext } from "./-context";

const INITIAL_ASSESSMENT: AssessmentResult = {
  overallScore: 68,
  problemValidation: 75,
  customerValidation: 60,
  productReadiness: 70,
  marketOpportunity: 65,
  businessModel: 55,
  teamStrength: 80,
  financialHealth: 50,
  executionGrowth: 60,
  diagnosis: "Your startup shows good conceptual alignment. Customer interviews lag behind technical preparation. Focus on unbiased, un-pitched discovery before deploying complete MVP builds.",
  recommendations: [
    "Conduct 10 qualitative problem interviews",
    "Define quantitative buyer profiles",
    "Perform code validation drills"
  ],
  strengths: ["Strong competitor differentiation", "High technical setup readiness"],
  risks: ["Limited user problem discovery", "Unvalidated pricing cohorts"],
  recommendedActions: [
    "Conduct 10 qualitative problem interviews",
    "Define quantitative buyer profiles",
    "Perform code validation drills"
  ]
};

const INITIAL_PHASES: RoadmapPhase[] = [
  {
    id: 1,
    phaseName: "Phase 1: Problem Discovery",
    targetDuration: "Weeks 1-3",
    progress: 50,
    iconName: "Compass",
    milestones: [
      { id: "m1-1", title: "Problem Definition Matrix", description: "Draft the primary consumer pain point and articulate critical competitor shortcomings.", completed: true, locked: false },
      { id: "m1-2", title: "Customer Segment Hypothesis", description: "Establish a list of 3 candidate demographic groups facing high daily friction.", completed: true, locked: false },
      { id: "m1-3", title: "Unbiased Competitor Audit", description: "Map features, pricing points, and review grids of the top 5 alternatives.", completed: false, locked: false },
      { id: "m1-4", title: "Value Proposition Blueprint", description: "Establish how your product builds a 10x workflow upgrade over alternative setups.", completed: false, locked: false }
    ]
  },
  {
    id: 2,
    phaseName: "Phase 2: Discovery Validation",
    targetDuration: "Weeks 4-6",
    progress: 0,
    iconName: "Activity",
    milestones: [
      { id: "m2-1", title: "First 10 Discovery Calls", description: "Conduct customer calls regarding friction points without pitching your solution.", completed: false, locked: false },
      { id: "m2-2", title: "First 25 Interview Transcripts", description: "Gather 25 systematic transcript responses identifying key words.", completed: false, locked: true },
      { id: "m2-3", title: "Verify High Pain Patterns", description: "Summarize if at least 15 interviewees rank the pain in their top 3 issues.", completed: false, locked: true },
      { id: "m2-4", title: "Core Demographics Survey", description: "Acquire 50 quantitative response values confirming buyer trends.", completed: false, locked: true }
    ]
  },
  {
    id: 3,
    phaseName: "Phase 3: Prototype & MVP",
    targetDuration: "Weeks 7-10",
    progress: 0,
    iconName: "Layers",
    milestones: [
      { id: "m3-1", title: "Clickable UI Overviews", description: "Design a high-fidelity visual preview of the primary workspace screens.", completed: false, locked: true },
      { id: "m3-2", title: "Minimal Functional Core", description: "Build and run the minimum code loop addressing the candidate pain point.", completed: false, locked: true },
      { id: "m3-3", title: "Interactive Closed Beta Runs", description: "Deploy basic preview routes to 5 cohort groups for live usability test sessions.", completed: false, locked: true },
      { id: "m3-4", title: "Qualitative User Logs", description: "Log quantitative interactions and identify navigation bugs.", completed: false, locked: true }
    ]
  },
  {
    id: 4,
    phaseName: "Phase 4: Market Entry",
    targetDuration: "Weeks 11-13",
    progress: 0,
    iconName: "TrendingUp",
    milestones: [
      { id: "m4-1", title: "First Anchor pilot", description: "Convert 1 beta brand or customer into an active full-workflow tester.", completed: false, locked: true },
      { id: "m4-2", title: "First 5 active clients", description: "Acquire 5 recurring active accounts utilizing files daily.", completed: false, locked: true },
      { id: "m4-3", title: "Verify transaction rails", description: "Finalize and test billing gateways, receipt logs, and invoices.", completed: false, locked: true },
      { id: "m4-4", title: "First Paying Account", description: "Close your first commercial transaction with real-world revenue.", completed: false, locked: true }
    ]
  },
  {
    id: 5,
    phaseName: "Phase 5: Early Scalability",
    targetDuration: "Weeks 14-16",
    progress: 0,
    iconName: "Award",
    milestones: [
      { id: "m5-1", title: "Earn 10k Baseline Revenue", description: "Validate continuous commercial value conversion by hitting baseline metrics.", completed: false, locked: true },
      { id: "m5-2", title: "Document User Case Studies", description: "Acquire 3 detailed client statements documenting positive business outcomes.", completed: false, locked: true },
      { id: "m5-3", title: "Establish Key Partnerships", description: "Secure a strategic promotional arrangement with a community or newsletter network.", completed: false, locked: true },
      { id: "m5-4", title: "SaaS Referral Mechanics", description: "Draft automated invitation passes and reward coupons.", completed: false, locked: true }
    ]
  },
  {
    id: 6,
    phaseName: "Phase 6: Seed Readiness",
    targetDuration: "Weeks 17-20",
    progress: 0,
    iconName: "Briefcase",
    milestones: [
      { id: "m6-1", title: "ISO Compliance Audits", description: "Verify secure encryption structures and clear server credentials configurations.", completed: false, locked: true },
      { id: "m6-2", title: "Seed Deck Package Prep", description: "Secure a v1 pitch deck, multi-tier spreadsheet models, and structured agreements.", completed: false, locked: true },
      { id: "m6-3", title: "Advisor Warm Inspections", description: "Verify financial variables with external incubator leaders or mentors.", completed: false, locked: true },
      { id: "m6-4", title: "First 3 Angel Meetings", description: "Conduct presentation passes with VC associates or capital groups.", completed: false, locked: true }
    ]
  }
];

const INITIAL_TASKS: Task[] = [
  { id: "t1", title: "Draft problem discovery script", description: "Write list of 5 open-ended questions targeting workflow pain points without pitching features.", status: 'To Do', priority: 'High', assignedTo: "Founder (You)", deadline: "2026-06-20", progress: 0, category: 'Daily' },
  { id: "t2", title: "Benchmark peer features & pricing parameters", description: "Log pricing structures, subscription layers, and entry-level packages of top 3 alternatives.", status: 'In Progress', priority: 'Medium', assignedTo: "Analyst Karan", deadline: "2026-06-22", progress: 40, category: 'Weekly' },
  { id: "t3", title: "Audit financial master spreadsheets", description: "Verify custom unit-economics inputs and standard conversion logs for due diligence packages.", status: 'Review', priority: 'High', assignedTo: "Advisor Meera", deadline: "2026-06-25", progress: 90, category: 'Team' },
  { id: "t4", title: "Establish core user interview cohort", description: "Filter LinkedIn networks to compile a robust target contact list of 30 product managers.", status: 'Completed', priority: 'Low', assignedTo: "Founder (You)", deadline: "2026-06-16", progress: 100, category: 'Daily' }
];

const INITIAL_DOCUMENTS: DocumentInfo[] = [
  { id: "doc-1", type: "Pitch Deck", status: "Uploaded", name: "Alpha_Group_PitchDeck_Draft1.pdf", size: "4.2 MB" },
  { id: "doc-2", type: "Financial Model", status: "Empty" },
  { id: "doc-3", type: "Business Plan", status: "Empty" },
  { id: "doc-4", type: "Market Research", status: "Empty" },
  { id: "doc-5", type: "Investor QA", status: "Empty" }
];

const INITIAL_BADGES: AchievementBadge[] = [
  { id: "b1", title: "Auditing Master", description: "Completed the core startup diagnostic assessment questionnaire.", category: "Assessment", points: 100, icon: "ClipboardCheck", unlocked: true, unlockedAt: "Jun 16" },
  { id: "b2", title: "Community Pillar", description: "Participate in co-founder discussions or post an ecosystem thread.", category: "Community", points: 100, icon: "Users", unlocked: false },
  { id: "b3", title: "Agile Executor", description: "Successfully create or resolve active sprint tasks.", category: "Tasks", points: 100, icon: "Award", unlocked: false },
  { id: "b4", title: "Data Room Vetted", description: "Upload your initial pitch deck to the secure investor data room.", category: "Docs", points: 150, icon: "Briefcase", unlocked: false },
  { id: "b5", title: "AI Visionary", description: "Dialogue with Gemini Copilot to refine startup strategies.", category: "AI", points: 100, icon: "Sparkles", unlocked: false }
];

export default function StartupLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [copilotSessionId, setCopilotSessionId] = useState<string | null>(null);

  // Core functional states
  const [assessment, setAssessment] = useState<AssessmentResult>(INITIAL_ASSESSMENT);
  const [phases, setPhases] = useState<RoadmapPhase[]>(INITIAL_PHASES);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [documents, setDocuments] = useState<DocumentInfo[]>(INITIAL_DOCUMENTS);
  const [badges, setBadges] = useState<AchievementBadge[]>(INITIAL_BADGES);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }
        setUserId(user.id);

        // 1. Load Startup Profile (for overall score, stage, etc.)
        const { data: profile } = await supabase
          .from('startup_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // 2. Load Assessment
        const { data: assessments } = await supabase
          .from('startup_assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (assessments && assessments.length > 0) {
          const dbAssessment = assessments[0];
          setAssessment({
            overallScore: dbAssessment.overall_score || 0,
            problemValidation: dbAssessment.problem_validation || 0,
            customerValidation: dbAssessment.customer_validation || 0,
            productReadiness: dbAssessment.product_readiness || 0,
            marketOpportunity: dbAssessment.market_opportunity || 0,
            businessModel: dbAssessment.business_model || 0,
            teamStrength: dbAssessment.team_strength || 0,
            financialHealth: dbAssessment.financial_health || 0,
            executionGrowth: dbAssessment.execution_growth || 0,
            diagnosis: dbAssessment.diagnosis || "",
            recommendations: Array.isArray(dbAssessment.recommendations) ? dbAssessment.recommendations : []
          });
        } else {
          // If no assessment, keep default with overallScore 0 (so they take the audit)
          setAssessment({
            overallScore: 0,
            problemValidation: 0,
            customerValidation: 0,
            productReadiness: 0,
            marketOpportunity: 0,
            businessModel: 0,
            teamStrength: 0,
            financialHealth: 0,
            executionGrowth: 0,
            diagnosis: "",
            recommendations: []
          });
        }

        // 3. Load Roadmap Phases and Milestones
        const { data: dbPhases } = await supabase
          .from('startup_roadmap_phases')
          .select('*, startup_roadmap_milestones(*)')
          .eq('user_id', user.id)
          .order('phase_number', { ascending: true });

        if (dbPhases && dbPhases.length > 0) {
          const formattedPhases: RoadmapPhase[] = dbPhases.map((p: any) => ({
            id: p.phase_number,
            phaseName: p.phase_name,
            targetDuration: p.target_duration,
            progress: p.progress,
            iconName: p.icon_name,
            milestones: (p.startup_roadmap_milestones || [])
              .sort((a: any, b: any) => a.sort_order - b.sort_order)
              .map((m: any) => ({
                id: m.id,
                title: m.title,
                description: m.description,
                completed: m.completed,
                locked: m.locked
              }))
          }));
          setPhases(formattedPhases);
        } else {
          // Seed Roadmap Phases
          const seededPhases: RoadmapPhase[] = [];
          for (const phase of INITIAL_PHASES) {
            const { data: newPhase } = await supabase
              .from('startup_roadmap_phases')
              .insert({
                user_id: user.id,
                phase_number: phase.id,
                phase_name: phase.phaseName,
                target_duration: phase.targetDuration,
                icon_name: phase.iconName,
                progress: phase.progress
              })
              .select()
              .single();

            if (newPhase) {
              const milestonesToInsert = phase.milestones.map((m, index) => ({
                phase_id: newPhase.id,
                title: m.title,
                description: m.description,
                completed: m.completed,
                locked: m.locked,
                sort_order: index
              }));

              const { data: newMilestones } = await supabase
                .from('startup_roadmap_milestones')
                .insert(milestonesToInsert)
                .select();

              seededPhases.push({
                ...phase,
                milestones: (newMilestones || []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((m: any) => ({
                  id: m.id,
                  title: m.title,
                  description: m.description,
                  completed: m.completed,
                  locked: m.locked
                }))
              });
            }
          }
          setPhases(seededPhases);
        }

        // 4. Load Tasks
        const { data: dbTasks } = await supabase
          .from('startup_tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (dbTasks && dbTasks.length > 0) {
          setTasks(dbTasks.map((t: any) => ({
            id: t.id,
            title: t.title,
            description: t.description || "",
            status: t.status as TaskStatus,
            priority: t.priority,
            assignedTo: t.assigned_to || "",
            deadline: t.deadline || "",
            progress: t.progress || 0,
            category: t.category,
            aiSuggestion: t.ai_suggestion || undefined
          })));
        } else {
          // Seed INITIAL_TASKS
          const tasksToInsert = INITIAL_TASKS.map(t => ({
            user_id: user.id,
            title: t.title,
            description: t.description,
            status: t.status,
            priority: t.priority,
            assigned_to: t.assignedTo,
            deadline: t.deadline || null,
            progress: t.progress,
            category: t.category
          }));
          const { data: seededTasks } = await supabase
            .from('startup_tasks')
            .insert(tasksToInsert)
            .select();

          if (seededTasks) {
            setTasks(seededTasks.map((t: any) => ({
              id: t.id,
              title: t.title,
              description: t.description || "",
              status: t.status as TaskStatus,
              priority: t.priority,
              assignedTo: t.assigned_to || "",
              deadline: t.deadline || "",
              progress: t.progress || 0,
              category: t.category,
              aiSuggestion: t.ai_suggestion || undefined
            })));
          }
        }

        // 5. Load Documents
        const { data: dbDocs } = await supabase
          .from('startup_documents')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (dbDocs && dbDocs.length > 0) {
          setDocuments(dbDocs.map((d: any) => ({
            id: d.id,
            type: d.doc_type,
            name: d.file_name || undefined,
            fileUrl: d.file_url || undefined,
            status: d.status,
            score: d.score || undefined,
            size: d.file_size || undefined,
            generalFeedback: d.general_feedback || undefined,
            slideFeedback: Array.isArray(d.slide_feedback) ? d.slide_feedback : undefined
          })));
        } else {
          // Seed INITIAL_DOCUMENTS
          const docsToInsert = INITIAL_DOCUMENTS.map(d => ({
            user_id: user.id,
            doc_type: d.type,
            file_name: d.name || null,
            status: d.status,
            file_size: d.size || null
          }));
          const { data: seededDocs } = await supabase
            .from('startup_documents')
            .insert(docsToInsert)
            .select();

          if (seededDocs) {
            setDocuments(seededDocs.map((d: any) => ({
              id: d.id,
              type: d.doc_type,
              name: d.file_name || undefined,
              fileUrl: d.file_url || undefined,
              status: d.status,
              score: d.score || undefined,
              size: d.file_size || undefined,
              generalFeedback: d.general_feedback || undefined,
              slideFeedback: Array.isArray(d.slide_feedback) ? d.slide_feedback : undefined
            })));
          }
        }

        // 6. Load Achievements & Badges
        const { data: allAchievements } = await supabase
          .from('achievements')
          .select('*')
          .eq('dashboard', 'startup');

        let startupAchievements = allAchievements || [];

        if (startupAchievements.length === 0) {
          // Seed achievements
          const achievementsToInsert = INITIAL_BADGES.map(b => ({
            code: b.id,
            title: b.title,
            description: b.description,
            icon: b.icon,
            points: b.points,
            category: b.category,
            dashboard: 'startup'
          }));
          const { data: seededAchievements } = await supabase
            .from('achievements')
            .insert(achievementsToInsert)
            .select();
          if (seededAchievements) {
            startupAchievements = seededAchievements;
          }
        }

        const { data: earned } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id);

        const earnedIds = new Set((earned || []).map((e: any) => e.achievement_id));
        const earnedMap = new Map((earned || []).map((e: any) => [e.achievement_id, e.earned_at]));

        const mappedBadges: AchievementBadge[] = startupAchievements.map((ach: any) => {
          const isEarned = earnedIds.has(ach.id);
          const earnedAt = earnedMap.get(ach.id);
          return {
            id: ach.code,
            dbId: ach.id,
            title: ach.title,
            description: ach.description,
            category: ach.category,
            points: ach.points,
            icon: ach.icon,
            unlocked: isEarned,
            unlockedAt: earnedAt ? new Date(earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : undefined
          };
        });

        mappedBadges.sort((a, b) => a.id.localeCompare(b.id));
        setBadges(mappedBadges.length > 0 ? mappedBadges : INITIAL_BADGES);

        // 7. Load Copilot Session
        const { data: sessions } = await supabase
          .from('copilot_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('dashboard', 'startup')
          .order('created_at', { ascending: false })
          .limit(1);

        let activeSessionId = sessions && sessions.length > 0 ? sessions[0].id : null;

        if (!activeSessionId) {
          const { data: newSession } = await supabase
            .from('copilot_sessions')
            .insert({
              user_id: user.id,
              dashboard: 'startup',
              title: 'AI Co-founder Session'
            })
            .select()
            .single();

          if (newSession) {
            activeSessionId = newSession.id;
          }
        }

        setCopilotSessionId(activeSessionId);

        if (activeSessionId) {
          const { data: dbMessages } = await supabase
            .from('copilot_messages')
            .select('*')
            .eq('session_id', activeSessionId)
            .order('created_at', { ascending: true });

          if (dbMessages && dbMessages.length > 0) {
            setMessages(dbMessages.map((m: any) => ({
              sender: m.sender,
              text: m.content,
              timestamp: new Date(m.created_at)
            })));
          } else {
            const welcomeText = "Greetings! I am your AI execution partner. Let's translate your raw validation diagnostics into operational milestone completions.";
            await supabase
              .from('copilot_messages')
              .insert({
                session_id: activeSessionId,
                sender: 'assistant',
                content: welcomeText
              });
            setMessages([{
              sender: 'assistant',
              text: welcomeText,
              timestamp: new Date()
            }]);
          }
        }

      } catch (err) {
        console.error("Error loading startup dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Helper to unlock a badge in the DB
  const unlockBadgeInDb = async (badgeId: string) => {
    if (!userId) return;
    const supabase = createClient();
    if (!supabase) return;

    const badge = badges.find(b => b.id === badgeId);
    if (!badge || badge.unlocked) return;

    let targetDbId = badge.dbId;
    if (!targetDbId) {
      const { data: ach } = await supabase
        .from('achievements')
        .select('id')
        .eq('code', badgeId)
        .eq('dashboard', 'startup')
        .single();
      if (ach) targetDbId = ach.id;
    }

    if (targetDbId) {
      try {
        await supabase.from('user_achievements').insert({
          user_id: userId,
          achievement_id: targetDbId
        });
        setBadges(prev => prev.map(b => b.id === badgeId ? { ...b, unlocked: true, unlockedAt: "Just Now" } : b));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Handle assessment update
  const handleCompleteAssessment = async (result: AssessmentResult) => {
    setAssessment(result);
    
    if (userId) {
      const supabase = createClient();
      if (supabase) {
        await supabase
          .from('startup_profiles')
          .update({ overall_score: result.overallScore })
          .eq('user_id', userId);

        await supabase
          .from('startup_assessments')
          .insert({
            user_id: userId,
            overall_score: result.overallScore,
            problem_validation: result.problemValidation,
            customer_validation: result.customerValidation,
            product_readiness: result.productReadiness,
            market_opportunity: result.marketOpportunity,
            business_model: result.businessModel,
            team_strength: result.teamStrength,
            financial_health: result.financialHealth,
            execution_growth: result.executionGrowth,
            diagnosis: result.diagnosis,
            recommendations: result.recommendations,
            completed_at: new Date().toISOString()
          });
      }
    }

    await unlockBadgeInDb('b1');
  };

  const handleUnlockDiagnosticBadge = async () => {
    await unlockBadgeInDb('b1');
  };

  // Toggle milestone checkbox on roadmap
  const handleToggleMilestone = async (phaseId: number, milestoneId: string) => {
    const supabase = createClient();
    if (!supabase) return;

    let currentCompletedStatus = false;
    phases.forEach(p => {
      const m = p.milestones.find(m => m.id === milestoneId);
      if (m) currentCompletedStatus = m.completed;
    });

    await supabase
      .from('startup_roadmap_milestones')
      .update({ completed: !currentCompletedStatus })
      .eq('id', milestoneId);

    setPhases(prev => {
      const updated = prev.map(phase => {
        if (phase.id !== phaseId) return phase;

        const updatedMilestones = phase.milestones.map(m => {
          if (m.id !== milestoneId) return m;
          return { ...m, completed: !m.completed };
        });

        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const totalCount = updatedMilestones.length;
        const phaseProgress = Math.round((completedCount / totalCount) * 100);

        supabase.from('startup_roadmap_phases')
          .update({ progress: phaseProgress })
          .eq('phase_number', phaseId)
          .eq('user_id', userId)
          .then();

        return { ...phase, progress: phaseProgress, milestones: updatedMilestones };
      });

      const phase1 = updated.find(p => p.id === 1);
      const phase1Completed = phase1?.milestones.filter(m => m.completed).length || 0;
      
      return updated.map(phase => {
        if (phase.id === 2) {
          const lockedState = phase1Completed < 2;
          const updatedMilestones = phase.milestones.map(m => {
            if (m.locked !== lockedState) {
              supabase.from('startup_roadmap_milestones').update({ locked: lockedState }).eq('id', m.id).then();
            }
            return { ...m, locked: lockedState };
          });
          return { ...phase, milestones: updatedMilestones };
        }
        return phase;
      });
    });
  };

  // Add agile task
  const handleAddTask = async (newTask: Omit<Task, 'id'>) => {
    if (!userId) return;
    const supabase = createClient();
    if (!supabase) return;

    const { data: dbTask } = await supabase
      .from('startup_tasks')
      .insert({
        user_id: userId,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        assigned_to: newTask.assignedTo,
        deadline: newTask.deadline || null,
        progress: newTask.progress,
        category: newTask.category
      })
      .select()
      .single();

    if (dbTask) {
      const taskRecord: Task = {
        id: dbTask.id,
        title: dbTask.title,
        description: dbTask.description || "",
        status: dbTask.status as TaskStatus,
        priority: dbTask.priority,
        assignedTo: dbTask.assigned_to || "",
        deadline: dbTask.deadline || "",
        progress: dbTask.progress || 0,
        category: dbTask.category,
        aiSuggestion: dbTask.ai_suggestion || undefined
      };
      setTasks(prev => [taskRecord, ...prev]);
    }

    await unlockBadgeInDb('b3');
  };

  // Update task status from Kanban or table
  const handleUpdateTaskStatus = async (taskId: string, status: TaskStatus) => {
    const supabase = createClient();
    if (supabase) {
      await supabase
        .from('startup_tasks')
        .update({ status: status })
        .eq('id', taskId);
    }
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: status } : t));
  };

  // Update task AI suggestion
  const handleUpdateTaskSuggestion = async (taskId: string, suggestion: string) => {
    const supabase = createClient();
    if (supabase) {
      await supabase
        .from('startup_tasks')
        .update({ ai_suggestion: suggestion })
        .eq('id', taskId);
    }
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, aiSuggestion: suggestion } : t));
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    const supabase = createClient();
    if (supabase) {
      await supabase
        .from('startup_tasks')
        .delete()
        .eq('id', taskId);
    }
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Upload file inside data room
  const handleUploadDocument = async (docId: string, name: string) => {
    const supabase = createClient();
    if (supabase) {
      await supabase
        .from('startup_documents')
        .update({
          file_name: name,
          status: 'Uploaded',
          file_size: "2.5 MB"
        })
        .eq('id', docId);
    }
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, name: name, status: 'Uploaded', size: "2.5 MB" } : doc
    ));
  };

  // Save audited document parameters
  const handleUpdateDocumentAnalysis = async (docId: string, analysisData: any) => {
    const supabase = createClient();
    if (supabase) {
      await supabase
        .from('startup_documents')
        .update({
          score: analysisData.score,
          general_feedback: analysisData.generalFeedback,
          slide_feedback: analysisData.slideFeedback
        })
        .eq('id', docId);
    }
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { 
        ...doc, 
        score: analysisData.score, 
        generalFeedback: analysisData.generalFeedback,
        slideFeedback: analysisData.slideFeedback 
      } : doc
    ));
  };

  // AI Dialog messages hooks
  const handleAddMessage = async (newMessage: Message) => {
    setMessages(prev => [...prev, newMessage]);

    if (copilotSessionId) {
      const supabase = createClient();
      if (supabase) {
        await supabase
          .from('copilot_messages')
          .insert({
            session_id: copilotSessionId,
            sender: newMessage.sender,
            content: newMessage.text
          });
      }
    }

    await unlockBadgeInDb('b5');
  };

  const handleUnlockArchiveBadge = async () => {
    await unlockBadgeInDb('b4');
  };

  const handleUnlockAIBadge = async () => {
    await unlockBadgeInDb('b5');
  };

  const handleNavigate = (tab: string) => {
    const routeMap: Record<string, string> = {
      'Home': '/app/startup',
      'Assessment': '/app/startup/assessment',
      'Roadmap': '/app/startup/roadmap',
      'Tasks': '/app/startup/tasks',
      'Achievement Vault': '/app/startup/vault',
      'Mentors': '/app/startup/mentors',
    };
    if (routeMap[tab]) {
      router.push(routeMap[tab]);
    }
  };

  const contextValue = {
    assessmentResult: assessment,
    savedResult: assessment,
    phases,
    roadmapPhases: phases,
    tasks,
    documents,
    badges,
    messages,
    overallScore: assessment.overallScore,
    onSaveAssessment: handleCompleteAssessment,
    onUnlockDiagnosticBadge: handleUnlockDiagnosticBadge,
    onToggleMilestone: handleToggleMilestone,
    onAddTask: handleAddTask,
    onUpdateTaskStatus: handleUpdateTaskStatus,
    onUpdateTaskSuggestion: handleUpdateTaskSuggestion,
    onDeleteTask: handleDeleteTask,
    onUploadDocument: handleUploadDocument,
    onUpdateAnalysis: handleUpdateDocumentAnalysis,
    onUnlockArchiveBadge: handleUnlockArchiveBadge,
    onAddMessage: handleAddMessage,
    onUnlockAIBadge: handleUnlockAIBadge,
    onNavigate: handleNavigate
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0B0F19] text-white">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-slate-900/40 border border-[#1F2947] backdrop-blur-md shadow-2xl">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
          </div>
          <div className="space-y-1 text-center">
            <h3 className="font-display font-extrabold text-sm tracking-tight text-white animate-pulse">Launching Command Center...</h3>
            <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Synchronizing Supabase Vitals</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[calc(100vh-80px)] w-full bg-[#0B0F19] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="flex-1 flex flex-col h-full min-w-0 bg-[#0B0F19]">
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-6 lg:px-10 border-b border-[#1F2947] backdrop-blur-md z-10">
          <h2 className="text-xl font-bold text-white capitalize">
             {pathname.split('/').pop() === 'startup' ? 'Dashboard' : pathname.split('/').pop()?.replace('-', ' ')}
          </h2>
          <div className="flex items-center gap-4">
            <div className="bg-[#0F1528] border border-[#1F2947] px-3 py-1.5 rounded-xl flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                Startup level: {Math.floor(assessment.overallScore / 20) + 1}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-10 relative bg-[#0B0F19]">
          <div className="max-w-7xl mx-auto">
            <StartupContext.Provider value={contextValue}>
              {children}
            </StartupContext.Provider>
          </div>
        </main>
      </div>
    </div>
  );
}
