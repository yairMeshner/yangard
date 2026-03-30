/**
 * Builds the full LLM prompt for analyzing a child's activity.
 *
 * @param {Object} child - Child info from the DB
 * @param {string} child.name
 * @param {number} child.year_of_birth
 * @param {string} child.gender
 * @param {string|null} child.mental_considerations
 * @param {Object} textByApp - Key: app name, Value: combined text typed in that app
 * Example: { "Discord": "hey you better watch out...", "Chrome": "how to hurt someone" }
 */
export function buildPrompt(child, textByApp) {
  const age = new Date().getFullYear() - child.year_of_birth
  const pronoun = child.gender?.toLowerCase() === 'female' ? 'she' : 'he'
  const possessive = child.gender?.toLowerCase() === 'female' ? 'her' : 'his'

  const childContext = `
Child Profile:
- Name: ${child.name}
- Age: ${age} years old
- Gender: ${child.gender}
- Mental health considerations: ${child.mental_considerations ?? 'None reported'}
`.trim()

  const activityText = JSON.stringify(textByApp, null, 2)

  const responseFormat = `
Respond ONLY with a valid JSON object in the following format, with no explanation or text outside the JSON:

{
  "overall_summary": "<A 3-5 sentence clinical summary of the child's overall activity and emotional state for this period. Write in third person using the child's name. Be professional and direct.>",
  "alerts": [
    {
      "id": <number>,
      "severity": "<HIGH | MEDIUM | LOW>",
      "title": "<Short title of the issue, max 8 words>",
      "summary": "<1-2 sentence clinical description of the concern. Do not quote the child directly. Describe the pattern or behavior.>",
      "time": "<HH:MM if available, otherwise omit this field>",
      "sources": ["<app name>"]
    }
  ]
}

Severity definitions:
- HIGH: Immediate risk to the child or others. Includes threats, self-harm, abuse, or grooming.
- MEDIUM: Concerning behavioral patterns requiring parental attention. Includes bullying, repeated inappropriate content, or signs of emotional distress.
- LOW: Mild policy violations or curiosity-driven behavior. Low immediate risk but worth noting.

If no alerts are found, return an empty alerts array.
`.trim()

  return `
You are a child psychologist and digital safety analyst. Your role is to analyze the digital activity of a child and produce a clinical report for their parent. You must assess the content for signs of bullying, self-harm, threats, emotional distress, inappropriate content, and any other concerning behavioral patterns.

You are analyzing activity for the following child:
${childContext}

Keep the child's age, gender, and mental health profile in mind throughout your analysis. A concern that may be low severity for one child may be high severity for another given ${possessive} specific mental health considerations.

Below is the child's typed activity as a JSON object. Each key is the name of an application, and each value is the full text typed by the child in that application during the analysis period:

${activityText}

${responseFormat}
`.trim()
}
