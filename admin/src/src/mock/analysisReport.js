const analysisReport = {
  analysis_date: "2026-03-28",
  user_uuid: "a3f8c2d1-1234-5678-abcd-ef0123456789",
  overall_summary: "Today was a concerning day for Daniel. Two high-severity alerts were detected, including threatening messages sent to classmates and repeated self-harm related searches. These patterns suggest Daniel may be experiencing significant emotional distress and social conflict. Immediate attention is recommended. Three additional medium and low severity alerts were also flagged, indicating exposure to inappropriate content and mild curiosity-driven searches.",
  alerts: [
    {
      id: 1,
      severity: "HIGH",
      title: "Threatening language toward peers",
      summary: "Daniel is sending threatening messages to classmates, warning them to stay away or face consequences.",
      time: "14:32",
      sources: ["Discord", "Keylogger"]
    },
    {
      id: 2,
      severity: "HIGH",
      title: "Self-harm related search activity",
      summary: "Daniel searched multiple times for content related to self-harm. Queries show a pattern of distress rather than academic curiosity.",
      time: "16:10",
      sources: ["Chrome", "Search History"]
    },
    {
      id: 3,
      severity: "MEDIUM",
      title: "Cyberbullying pattern detected",
      summary: "Daniel is participating in coordinated exclusion of a peer across multiple platforms over the past two days.",
      time: "11:15",
      sources: ["WhatsApp Web", "Browser"]
    },
    {
      id: 4,
      severity: "MEDIUM",
      title: "Exposure to inappropriate content",
      summary: "Daniel accessed and spent extended time on content not suitable for his age group.",
      time: "09:45",
      sources: ["Chrome"]
    },
    {
      id: 5,
      severity: "LOW",
      title: "Mild inappropriate search terms",
      summary: "Daniel searched for mildly inappropriate content. Appears curiosity-driven with no follow-up access to concerning material.",
      time: "10:20",
      sources: ["Chrome", "Search History"]
    }
  ]
}

export default analysisReport
