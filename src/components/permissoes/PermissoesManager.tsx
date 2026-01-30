"use client";

import { useEffect, useState } from "react";

type Data = {
  roles: string[];
  permissions: Record<string, string[]>;
};

const ALL = [
  "dashboard",
  "usuarios",
  "eventos",
  "membros",
  "relatorios",
  "configuracoes",
];

export default function PermissoesManager() {
  const [data, setData] = useState<Data | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("ADMIN");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/permissoes");

        if (!r.ok) {
          throw new Error(`HTTP ${r.status}`);
        }

        const json = (await r.json()) as Partial<Data>;
        const roles = json.roles ?? ["ADMIN", "PASTOR", "USER"];
        const permissions = json.permissions ?? {};

        setData({ roles, permissions });
        setSelectedRole(roles[0] ?? "ADMIN");
      } catch (e: any) {
        console.error(e);
        setData({ roles: ["ADMIN", "PASTOR", "USER"], permissions: {} });
        setSelectedRole("ADMIN");
      }
    })();
  }, []);

  if (!data) return <div>Carregando...</div>;

  const current = new Set<string>(data.permissions[selectedRole] ?? []);

  function toggle(p: string) {
    const next = new Set(current);
    next.has(p) ? next.delete(p) : next.add(p);

    setData((prev) => {
      if (!prev) return prev;
      return {
        roles: prev.roles,
        permissions: {
          ...prev.permissions,
          [selectedRole]: Array.from(next),
        },
      };
    });
  }

  async function save() {
    if (!data) return;

    setSaving(true);
    try {
      await fetch("/api/permissoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: data.permissions }),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1>Permissões</h1>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <label>Role:</label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {data.roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <button onClick={save} disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {ALL.map((p) => (
          <label
            key={p}
            style={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={current.has(p)}
              onChange={() => toggle(p)}
            />
            {p}
          </label>
        ))}
      </div>
    </div>
  );
}
