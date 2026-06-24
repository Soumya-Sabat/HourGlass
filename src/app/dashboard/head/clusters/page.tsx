"use client";

import { useEffect, useState, useCallback } from "react";
import { Layers, ArrowUpDown, UserPlus, UserX, Plus, Minus } from "lucide-react";
import {
  getAllClusters, rearrangeCluster, removeClusterMemberByHod, addHodToCluster, removeHodFromCluster,
  type AllClusterData,
} from "@/actions/head-actions";

export default function HeadClustersPage() {
  const [clusters, setClusters] = useState<AllClusterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);
  const [yourId, setYourId] = useState("");

  const showMsg = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const c = await getAllClusters();
      setClusters(c);
    } catch { showMsg("Failed to load clusters."); }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Get current user ID from server action
  useEffect(() => {
    import("@/actions/head-actions").then((mod) => mod.getCurrentUserId()).then((id) => {
      setYourId(id);
    }).catch(() => {});
  }, []);

  const handleMoveUp = async (clusterId: string, currentOrder: number) => {
    await rearrangeCluster(clusterId, currentOrder - 1);
    showMsg("Cluster reordered.");
    await loadData();
  };

  const handleMoveDown = async (clusterId: string, currentOrder: number) => {
    await rearrangeCluster(clusterId, currentOrder + 1);
    showMsg("Cluster reordered.");
    await loadData();
  };

  const handleRemoveMember = async (clusterId: string, userId: string) => {
    await removeClusterMemberByHod(clusterId, userId);
    showMsg("Member removed.");
    await loadData();
  };

  const handleJoin = async (clusterId: string) => {
    await addHodToCluster(clusterId);
    showMsg("You joined the cluster.");
    await loadData();
  };

  const handleLeave = async (clusterId: string) => {
    await removeHodFromCluster(clusterId);
    showMsg("You left the cluster.");
    await loadData();
  };

  const isMember = (c: AllClusterData) => c.members.some((m) => m.userId === yourId);

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading clusters...</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Layers className="h-5 w-5 text-[#e28774]" /> Cluster Oversight
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">View all clusters, rearrange order, join/leave groups</p>
      </div>

      {msg && <div className="border-2 border-black bg-[#eae3cb] p-3 text-xs font-bold shadow-[3px_3px_0px_0px_#1a1a14]">{msg}</div>}

      {clusters.length === 0 && (
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-6 text-center text-sm font-bold text-gray-500">
          No clusters configured yet.
        </div>
      )}

      <div className="grid gap-4">
        {clusters.map((c) => (
          <div key={c.id} className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14]">
            <div className="border-b-2 border-black bg-[#1a1a14] p-2 text-[#f4ebd0] text-xs font-black uppercase flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>{c.name}</span>
                {c.subjectName && <span className="text-[9px] text-gray-400">({c.subjectName})</span>}
                {isMember(c) && <span className="text-[8px] bg-green-500 text-black px-1">MEMBER</span>}
              </div>
              <div className="flex gap-1 items-center">
                <button onClick={() => handleMoveUp(c.id, c.order)} title="Move up"
                  className="text-[9px] bg-[#f4ebd0] text-[#1a1a14] px-1.5 py-0.5 border border-black font-black hover:bg-[#e28774]">
                  <ArrowUpDown className="h-3 w-3 rotate-180" />
                </button>
                <button onClick={() => handleMoveDown(c.id, c.order)} title="Move down"
                  className="text-[9px] bg-[#f4ebd0] text-[#1a1a14] px-1.5 py-0.5 border border-black font-black hover:bg-[#e28774]">
                  <ArrowUpDown className="h-3 w-3" />
                </button>
                {isMember(c) ? (
                  <button onClick={() => handleLeave(c.id)}
                    className="text-[9px] bg-yellow-400 text-[#1a1a14] px-2 py-0.5 border border-black font-black hover:bg-yellow-300">
                    <Minus className="h-3 w-3 inline" /> Leave
                  </button>
                ) : (
                  <button onClick={() => handleJoin(c.id)}
                    className="text-[9px] bg-green-400 text-[#1a1a14] px-2 py-0.5 border border-black font-black hover:bg-green-300">
                    <Plus className="h-3 w-3 inline" /> Join
                  </button>
                )}
              </div>
            </div>

            <div className="p-3">
              <div className="flex items-center gap-3 text-[10px] font-bold text-gray-600 mb-2">
                <span>Lead: {c.leadName}</span>
                <span>{c.memberCount} member{c.memberCount !== 1 ? "s" : ""}</span>
                <span>Order: {c.order}</span>
                {c.createdAt && <span>Created: {c.createdAt}</span>}
              </div>

              <button onClick={() => setExpandedCluster(expandedCluster === c.id ? null : c.id)}
                className="text-[9px] font-black uppercase border border-black px-2 py-1 bg-white hover:bg-[#e28774] transition-colors mb-2">
                {expandedCluster === c.id ? "Hide Members" : `Show ${c.memberCount} Members`}
              </button>

              {expandedCluster === c.id && (
                <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                  {c.members.map((m) => (
                    <div key={m.userId} className="flex items-center justify-between border border-black bg-white p-1.5 text-[10px] font-bold">
                      <span>{m.name}{m.userId === c.leadId ? " (Lead)" : ""}{m.userId === yourId ? " (You)" : ""}</span>
                      <button onClick={() => handleRemoveMember(c.id, m.userId)}
                        className="text-red-500 hover:text-red-700">
                        <UserX className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
