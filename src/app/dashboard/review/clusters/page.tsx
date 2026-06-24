"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Layers, Plus, Trash2, UserPlus, UserX, MessageSquare } from "lucide-react";
import {
  getReviewerClusters, createCluster, addClusterMembers, removeClusterMember, deleteCluster,
  getAvailableFaculty, getReviewerSubjects,
  type ClusterData, type AvailableFaculty, type ReviewerSubject,
} from "@/actions/review-actions";

export default function ReviewerClustersPage() {
  const [clusters, setClusters] = useState<ClusterData[]>([]);
  const [faculty, setFaculty] = useState<AvailableFaculty[]>([]);
  const [subjects, setSubjects] = useState<ReviewerSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showAdd, setShowAdd] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  // Create form
  const [formName, setFormName] = useState("");
  const [formSubjectId, setFormSubjectId] = useState("");
  const [formSubjectName, setFormSubjectName] = useState("");
  const [formMembers, setFormMembers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Add member
  const [addIds, setAddIds] = useState<string[]>([]);

  const showMsg = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [c, f, s] = await Promise.all([
        getReviewerClusters(),
        getAvailableFaculty(),
        getReviewerSubjects(),
      ]);
      setClusters(c);
      setFaculty(f);
      setSubjects(s);
    } catch { showMsg("Failed to load data."); }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreate = async () => {
    if (!formName) { showMsg("Cluster name is required."); return; }
    setSaving(true);
    try {
      await createCluster({
        name: formName,
        subjectId: formSubjectId,
        subjectName: formSubjectName,
        memberIds: formMembers,
      });
      showMsg("Cluster created!");
      setShowCreate(false);
      setFormName(""); setFormSubjectId(""); setFormSubjectName(""); setFormMembers([]);
      await loadData();
    } catch { showMsg("Failed to create cluster."); }
    setSaving(false);
  };

  const handleAddMembers = async (clusterId: string) => {
    if (addIds.length === 0) return;
    try {
      await addClusterMembers(clusterId, addIds);
      showMsg("Members added!");
      setShowAdd(null);
      setAddIds([]);
      await loadData();
    } catch { showMsg("Failed to add members."); }
  };

  const handleRemoveMember = async (clusterId: string, userId: string) => {
    try {
      await removeClusterMember(clusterId, userId);
      showMsg("Member removed.");
      await loadData();
    } catch { showMsg("Failed to remove member."); }
  };

  const handleDelete = async (clusterId: string) => {
    if (!confirm("Delete this cluster?")) return;
    try {
      await deleteCluster(clusterId);
      showMsg("Cluster deleted.");
      await loadData();
    } catch { showMsg("Failed to delete."); }
  };

  const toggleFormMember = (id: string) => {
    setFormMembers((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleAddMember = (id: string) => {
    setAddIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading clusters...</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Layers className="h-5 w-5 text-[#e28774]" /> Subject Clusters
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Group faculty by subject for coordinated teaching</p>
      </div>

      {msg && <div className="border-2 border-black bg-[#eae3cb] p-3 text-xs font-bold shadow-[3px_3px_0px_0px_#1a1a14]">{msg}</div>}

      <button onClick={() => setShowCreate(!showCreate)}
        className="flex items-center gap-2 border-2 border-black bg-[#e28774] shadow-[3px_3px_0px_0px_#1a1a14] px-4 py-2 text-xs font-black uppercase hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all">
        <Plus className="h-4 w-4" /> {showCreate ? "Cancel" : "New Cluster"}
      </button>

      {/* Create Form */}
      {showCreate && (
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-4 space-y-3">
          <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Cluster name (e.g., Mathematics Core)"
            className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold" />

          <select value={formSubjectId} onChange={(e) => {
            const s = subjects.find((x) => x.id === e.target.value);
            setFormSubjectId(e.target.value);
            setFormSubjectName(s?.name || "");
          }}
            className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold">
            <option value="">Select subject (optional)</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          <div>
            <p className="text-[10px] font-black uppercase mb-1">Add Faculty Members:</p>
            <div className="max-h-40 overflow-y-auto border border-black bg-white p-2 space-y-1">
              {faculty.map((f) => (
                <label key={f.id} className="flex items-center gap-2 text-[10px] font-bold cursor-pointer">
                  <input type="checkbox" checked={formMembers.includes(f.id)} onChange={() => toggleFormMember(f.id)}
                    className="accent-[#e28774]" />
                  {f.name}
                </label>
              ))}
              {faculty.length === 0 && <p className="text-[10px] text-gray-500">No faculty available.</p>}
            </div>
          </div>

          <button onClick={handleCreate} disabled={saving}
            className="border-2 border-black bg-[#1a1a14] text-[#f4ebd0] px-4 py-2 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#e28774] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50">
            {saving ? "Creating..." : "Create Cluster"}
          </button>
        </div>
      )}

      {/* Cluster List */}
      {clusters.length === 0 && !showCreate && (
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-6 text-center text-sm font-bold text-gray-500">
          No clusters yet. Create your first one above.
        </div>
      )}

      <div className="grid gap-4">
        {clusters.map((c) => (
          <div key={c.id} className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14]">
            <div className="border-b-2 border-black bg-[#1a1a14] p-2 text-[#f4ebd0] text-xs font-black uppercase flex justify-between items-center">
              <span>{c.name} {c.subjectName ? `(${c.subjectName})` : ""}</span>
              <div className="flex gap-1">
                <Link href={`/dashboard/faculty/clusters/${c.id}`}
                  className="text-[9px] bg-white text-[#1a1a14] px-2 py-0.5 border border-black font-black hover:bg-[#e28774] transition-colors">
                  <MessageSquare className="h-3 w-3 inline" /> Chat
                </Link>
                <button onClick={() => { setShowAdd(showAdd === c.id ? null : c.id); setAddIds([]); }}
                  className="text-[9px] bg-[#e28774] text-[#1a1a14] px-2 py-0.5 border border-black font-black">
                  <UserPlus className="h-3 w-3 inline" /> Add
                </button>
                <button onClick={() => handleDelete(c.id)}
                  className="text-[9px] bg-red-400 text-[#1a1a14] px-2 py-0.5 border border-black font-black">
                  <Trash2 className="h-3 w-3 inline" />
                </button>
              </div>
            </div>

            <div className="p-3">
              {/* Add member UI */}
              {showAdd === c.id && (
                <div className="mb-3 border border-black bg-white p-2 space-y-1">
                  <p className="text-[9px] font-black uppercase">Select faculty to add:</p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {faculty.filter((f) => !c.members.some((m) => m.userId === f.id)).map((f) => (
                      <label key={f.id} className="flex items-center gap-2 text-[10px] font-bold cursor-pointer">
                        <input type="checkbox" checked={addIds.includes(f.id)} onChange={() => toggleAddMember(f.id)}
                          className="accent-[#e28774]" />
                        {f.name}
                      </label>
                    ))}
                    {faculty.filter((f) => !c.members.some((m) => m.userId === f.id)).length === 0 && (
                      <p className="text-[10px] text-gray-500">All faculty are already members.</p>
                    )}
                  </div>
                  <button onClick={() => handleAddMembers(c.id)}
                    className="text-[9px] font-black uppercase border border-black px-2 py-1 bg-[#e28774] hover:bg-[#d17664] transition-colors">
                    Add Selected
                  </button>
                </div>
              )}

              <p className="text-[10px] font-bold text-gray-600 mb-2">
                {c.memberCount} member{c.memberCount !== 1 ? "s" : ""}
                {c.createdAt ? ` · Created ${c.createdAt}` : ""}
              </p>

              <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {c.members.map((m) => (
                  <div key={m.userId} className="flex items-center justify-between border border-black bg-white p-1.5 text-[10px] font-bold">
                    <span>{m.name}</span>
                    <button onClick={() => handleRemoveMember(c.id, m.userId)}
                      className="text-red-500 hover:text-red-700">
                      <UserX className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
