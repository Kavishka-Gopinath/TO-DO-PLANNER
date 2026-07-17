import { create } from 'zustand'
import { persist } from 'zustand/middleware'

let idSeq = 1000
const uid = () => `t${++idSeq}`

const today = new Date()
const d = (offset = 0) => {
  const x = new Date(today)
  x.setDate(x.getDate() + offset)
  return x.toISOString().slice(0, 10)
}

const CATEGORIES = [
  { id: 'cat-personal', name: 'Personal', icon: 'User', color: '#10B981' },
  { id: 'cat-work', name: 'Work', icon: 'Briefcase', color: '#4F46E5' },
  { id: 'cat-college', name: 'College', icon: 'GraduationCap', color: '#F59E0B' },
  { id: 'cat-shopping', name: 'Shopping', icon: 'ShoppingBag', color: '#EC4899' },
  { id: 'cat-fitness', name: 'Fitness', icon: 'Dumbbell', color: '#EF4444' },
  { id: 'cat-learning', name: 'Learning', icon: 'BookOpen', color: '#7C3AED' },
  { id: 'cat-travel', name: 'Travel', icon: 'Plane', color: '#06B6D4' },
  { id: 'cat-finance', name: 'Finance', icon: 'Wallet', color: '#84CC16' },
]

const seedTasks = [
  {
    id: uid(),
    title: 'Finish React Dashboard',
    description: 'Complete the glassmorphism UI and wire up the charts.',
    category: 'cat-work',
    priority: 'high',
    status: 'in-progress',
    due: d(0),
    time: '14:00',
    duration: 2,
    tags: ['React', 'UI', 'Figma'],
    progress: 60,
    subtasks: [
      { id: uid(), title: 'Set up layout', done: true },
      { id: uid(), title: 'Build sidebar', done: true },
      { id: uid(), title: 'Add charts', done: false },
    ],
    repeat: 'none',
    reminder: true,
    attachment: true,
    assignee: 'Kavishka',
    createdAt: d(-1),
  },
  {
    id: uid(),
    title: 'Morning Run — 5km',
    description: 'Keep the streak alive. Light pace.',
    category: 'cat-fitness',
    priority: 'medium',
    status: 'pending',
    due: d(0),
    time: '07:00',
    duration: 1,
    tags: ['Health'],
    progress: 0,
    subtasks: [],
    repeat: 'daily',
    reminder: true,
    attachment: false,
    assignee: 'Kavishka',
    createdAt: d(-1),
  },
  {
    id: uid(),
    title: 'Prepare exam notes',
    description: 'Chapter 4–6 of Data Structures.',
    category: 'cat-college',
    priority: 'high',
    status: 'pending',
    due: d(0),
    time: '18:30',
    duration: 3,
    tags: ['Study'],
    progress: 0,
    subtasks: [],
    repeat: 'none',
    reminder: true,
    attachment: false,
    assignee: 'Kavishka',
    createdAt: d(-2),
  },
  {
    id: uid(),
    title: 'Grocery shopping',
    description: 'Milk, eggs, oats, bananas, coffee.',
    category: 'cat-shopping',
    priority: 'low',
    status: 'pending',
    due: d(0),
    time: '20:00',
    duration: 1,
    tags: ['Home'],
    progress: 0,
    subtasks: [],
    repeat: 'weekly',
    reminder: false,
    attachment: false,
    assignee: 'Kavishka',
    createdAt: d(0),
  },
  {
    id: uid(),
    title: 'Read 20 pages — Atomic Habits',
    description: 'Chapter on identity-based habits.',
    category: 'cat-learning',
    priority: 'low',
    status: 'completed',
    due: d(0),
    time: '21:00',
    duration: 1,
    tags: ['Reading'],
    progress: 100,
    subtasks: [],
    repeat: 'daily',
    reminder: false,
    attachment: false,
    assignee: 'Kavishka',
    createdAt: d(-3),
  },
  {
    id: uid(),
    title: 'Team standup',
    description: 'Sync on NGO website progress.',
    category: 'cat-work',
    priority: 'medium',
    status: 'completed',
    due: d(0),
    time: '10:00',
    duration: 1,
    tags: ['Meeting'],
    progress: 100,
    subtasks: [],
    repeat: 'weekdays',
    reminder: true,
    attachment: false,
    assignee: 'Kavishka',
    createdAt: d(-1),
  },
  {
    id: uid(),
    title: 'Plan weekend trip',
    description: 'Book stays and finalize itinerary.',
    category: 'cat-travel',
    priority: 'medium',
    status: 'pending',
    due: d(3),
    time: '16:00',
    duration: 2,
    tags: ['Trip'],
    progress: 0,
    subtasks: [],
    repeat: 'none',
    reminder: false,
    attachment: true,
    assignee: 'Kavishka',
    createdAt: d(0),
  },
  {
    id: uid(),
    title: 'Pay electricity bill',
    description: 'Before the 15th to avoid late fee.',
    category: 'cat-finance',
    priority: 'high',
    status: 'pending',
    due: d(2),
    time: '12:00',
    duration: 1,
    tags: ['Bills'],
    progress: 0,
    subtasks: [],
    repeat: 'monthly',
    reminder: true,
    attachment: false,
    assignee: 'Kavishka',
    createdAt: d(-2),
  },
  {
    id: uid(),
    title: 'Review pull requests',
    description: 'Two PRs pending on the main repo.',
    category: 'cat-work',
    priority: 'medium',
    status: 'backlog',
    due: d(1),
    time: '15:00',
    duration: 1,
    tags: ['Code', 'Review'],
    progress: 0,
    subtasks: [],
    repeat: 'none',
    reminder: false,
    attachment: false,
    assignee: 'Kavishka',
    createdAt: d(0),
  },
  {
    id: uid(),
    title: 'Design system cleanup',
    description: 'Consolidate tokens and remove dead styles.',
    category: 'cat-work',
    priority: 'low',
    status: 'review',
    due: d(4),
    time: '11:00',
    duration: 2,
    tags: ['UI'],
    progress: 80,
    subtasks: [],
    repeat: 'none',
    reminder: false,
    attachment: false,
    assignee: 'Kavishka',
    createdAt: d(-1),
  },
]

const seedProjects = [
  {
    id: 'p1',
    name: 'NGO Website',
    members: 4,
    progress: 72,
    deadline: '15 July',
    tasks: 18,
    files: 12,
    color: '#4F46E5',
  },
  {
    id: 'p2',
    name: 'Mobile App MVP',
    members: 3,
    progress: 45,
    deadline: '30 July',
    tasks: 24,
    files: 8,
    color: '#10B981',
  },
  {
    id: 'p3',
    name: 'Portfolio Redesign',
    members: 2,
    progress: 90,
    deadline: '10 July',
    tasks: 11,
    files: 6,
    color: '#F59E0B',
  },
  {
    id: 'p4',
    name: 'Research Paper',
    members: 5,
    progress: 30,
    deadline: '20 Aug',
    tasks: 30,
    files: 4,
    color: '#7C3AED',
  },
]

const seedNotes = [
  { id: 'n1', title: 'Meeting ideas', body: 'Brainstorm the new onboarding flow and simplify the pricing page.', pinned: true, folder: 'Work' },
  { id: 'n2', title: 'Book quotes', body: '“You do not rise to the level of your goals. You fall to the level of your systems.”', pinned: false, folder: 'Personal' },
  { id: 'n3', title: 'Weekend checklist', body: '- Laundry\n- Renew passport\n- Call mom', pinned: false, folder: 'Personal' },
]

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'today', label: "Today's Tasks", icon: 'Sun' },
  { id: 'upcoming', label: 'Upcoming', icon: 'CalendarClock' },
  { id: 'calendar', label: 'Calendar', icon: 'CalendarDays' },
  { id: 'kanban', label: 'Kanban', icon: 'KanbanSquare' },
  { id: 'categories', label: 'Categories', icon: 'Tag' },
  { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
  { id: 'notes', label: 'Notes', icon: 'StickyNote' },
  { id: 'pomodoro', label: 'Pomodoro', icon: 'Timer' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
  { id: 'profile', label: 'Profile', icon: 'UserCircle' },
]

export const useStore = create(
  persist(
    (set, get) => ({
      tasks: seedTasks,
      categories: CATEGORIES,
      projects: seedProjects,
      notes: seedNotes,
      navItems: NAV_ITEMS,
      activeView: 'dashboard',
      sidebarCollapsed: false,
      darkMode: true,
      user: {
        name: 'Kavishka',
        email: 'kavishka@taskflow.app',
        avatar: '',
        dailyGoal: 12,
        streak: 7,
        xp: 2480,
        level: 12,
      },
      toasts: [],
      aiOpen: false,
      loggedIn: false,

      setView: (v) => set({ activeView: v }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      toggleDark: () => set((s) => ({ darkMode: !s.darkMode })),
      setAI: (v) => set({ aiOpen: v }),

      login: (email) =>
        set((s) => ({
          loggedIn: true,
          user: { ...s.user, email: email || s.user.email },
        })),
      logout: () => set({ loggedIn: false }),

      addTask: (task) =>
        set((s) => ({
          tasks: [
            {
              id: uid(),
              status: 'pending',
              progress: 0,
              tags: [],
              subtasks: [],
              repeat: 'none',
              reminder: false,
              attachment: false,
              createdAt: new Date().toISOString().slice(0, 10),
              ...task,
            },
            ...s.tasks,
          ],
        })),

      updateTask: (id, patch) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),

      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      deleteProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

      toggleComplete: (id) => {
        const t = get().tasks.find((x) => x.id === id)
        const completing = t && t.status !== 'completed'
        set((s) => ({
          tasks: s.tasks.map((x) =>
            x.id === id
              ? {
                  ...x,
                  status: x.status === 'completed' ? 'pending' : 'completed',
                  progress: x.status === 'completed' ? x.progress : 100,
                }
              : x,
          ),
        }))
        if (completing) {
          get().addToast('Task completed! 🎉', 'success')
          window.dispatchEvent(new CustomEvent('taskflow:confetti'))
        }
      },

      moveTask: (id, status) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
        })),

      addNote: (note) =>
        set((s) => ({ notes: [{ id: uid(), folder: 'Personal', pinned: false, ...note }, ...s.notes] })),
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      addToast: (msg, type = 'success') => {
        const id = uid()
        set((s) => ({ toasts: [...s.toasts, { id, msg, type }] }))
        setTimeout(() => {
          set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
        }, 3000)
      },
      removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      // Derived helpers
      categoryById: (id) => get().categories.find((c) => c.id === id),
    }),
    {
      name: 'taskflow-store',
      partialize: (s) => ({
        tasks: s.tasks,
        projects: s.projects,
        notes: s.notes,
        sidebarCollapsed: s.sidebarCollapsed,
        darkMode: s.darkMode,
        user: s.user,
        activeView: s.activeView,
        loggedIn: s.loggedIn,
      }),
    },
  ),
)

export const PRIORITY_META = {
  high: { label: 'High', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  medium: { label: 'Medium', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  low: { label: 'Low', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
}

export const STATUS_COLUMNS = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'pending', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'completed', label: 'Completed' },
]
