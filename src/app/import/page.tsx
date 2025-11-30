"use client";

import { useState } from "react";

export default function ImportPage() {
  const [out, setOut] = useState<string>("");
  const [emailOverride, setEmailOverride] = useState("");
  const [passwordOverride, setPasswordOverride] = useState("");

  return (
    <div style={{ padding: 24 }}>
      <h1>Import Student</h1>
      <input type="email" placeholder="Email (optional)" value={emailOverride} onChange={e => setEmailOverride(e.target.value)} />
      <input type="password" placeholder="Password (optional)" value={passwordOverride} onChange={e => setPasswordOverride(e.target.value)} />
      <input type="file" accept=".json" onChange={async e => {
        const file = e.target.files?.[0];
        if (!file) return;
        const text = await file.text();
        const json = JSON.parse(text);
        type Account = { id?: string | number; email: string; name?: string; password?: string };
        type Education = { total_credits?: number; num_semesters?: number; semesters?: unknown };
        type StudentPayload = { account: Account; education: Education };
        let payload: StudentPayload;
        if (json.account && json.education) {
          payload = {
            account: {
              id: json.account.id,
              email: emailOverride || json.account.email,
              name: json.account.name || 'Student',
              password: passwordOverride || json.account.password
            },
            education: {
              total_credits: json.education.total_credits,
              num_semesters: json.education.num_semesters,
              semesters: json.education.semesters
            }
          };
        } else {
          payload = {
            account: {
              id: json.student_id,
              email: emailOverride || json.email,
              name: json.name || 'Student',
              password: passwordOverride || json.password
            },
            education: {
              total_credits: json.total_credits,
              num_semesters: json.num_semesters,
              semesters: json.semesters
            }
          };
        }
        const res = await fetch('http://localhost:5009/api/students/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        setOut(JSON.stringify(data, null, 2));
      }} />
      <pre>{out}</pre>
    </div>
  );
}
