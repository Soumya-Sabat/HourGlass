"use client";

import { useEffect, useState } from "react";
import { Users, Search, UserX, UserCheck, Plus, Trash2, Shield, Pencil } from "lucide-react";
import { getInstitutionUsers, suspendUser, activateUser, deleteUser, updateUserRole, addUser, updateUser, getDepartments, createDepartment, type InstitutionUser, type DepartmentInfo } from "@/actions/institution-actions";
import { roleOptions } from "@/components/forms/auth-role-options";

const roleLabels: Record<string, string> = {};
for (const r of roleOptions) roleLabels[r.value] = r.label;

export default function UsersPage() {
  const [users, setUsers] = useState<InstitutionUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Departments list
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);

  // Add user modal
  const [showAdd, setShowAdd] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addName, setAddName] = useState("");
  const [addRole, setAddRole] = useState("faculty");
  const [addDepartment, setAddDepartment] = useState("");
  const [addClassGroup, setAddClassGroup] = useState("");
  const [addSection, setAddSection] = useState("");
  const [addBatch, setAddBatch] = useState("");
  const [showNewDept, setShowNewDept] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Role change
  const [roleChangeId, setRoleChangeId] = useState<string | null>(null);
  const [roleChangeValue, setRoleChangeValue] = useState("");
  const [roleChangeError, setRoleChangeError] = useState("");

  // Edit user modal
  const [editUser, setEditUser] = useState<InstitutionUser | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("faculty");
  const [editDepartment, setEditDepartment] = useState("");
  const [editClassGroup, setEditClassGroup] = useState("");
  const [editSection, setEditSection] = useState("");
  const [editBatch, setEditBatch] = useState("");
  const [editError, setEditError] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    Promise.all([getInstitutionUsers(), getDepartments()])
      .then(([u, d]) => { setUsers(u); setDepartments(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    try {
      if (currentStatus === "Active") {
        await suspendUser(userId);
      } else {
        await activateUser(userId);
      }
      setUsers(users.map((u) => u.id === userId ? { ...u, status: currentStatus === "Active" ? "Suspended" : "Active" } : u));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteUser(deleteId);
      setUsers(users.filter((u) => u.id !== deleteId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setRoleChangeError("");
    try {
      await updateUserRole(userId, newRole);
      const fresh = await getInstitutionUsers();
      setUsers(fresh);
    } catch (err: any) {
      setRoleChangeError(err?.message || "Failed to update role.");
      return;
    }
    setRoleChangeId(null);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAdding(true);
    try {
      // Create new department if requested
      let dept = addDepartment;
      if (showNewDept && newDeptName.trim()) {
        await createDepartment({ name: newDeptName.trim(), head: "" });
        dept = newDeptName.trim();
        const freshDepts = await getDepartments();
        setDepartments(freshDepts);
      }
      await addUser({ email: addEmail, fullName: addName, role: addRole, department: dept || undefined, classGroup: addClassGroup || undefined, section: addSection || undefined, batch: addBatch || undefined });
      setShowAdd(false);
      setAddEmail("");
      setAddName("");
      setAddRole("faculty");
      setAddDepartment("");
      setAddClassGroup("");
      setAddSection("");
      setAddBatch("");
      setShowNewDept(false);
      setNewDeptName("");
      const fresh = await getInstitutionUsers();
      setUsers(fresh);
    } catch (err: any) {
      setAddError(err?.message || "Failed to add user");
    } finally {
      setAdding(false);
    }
  };

  const openEditModal = (user: InstitutionUser) => {
    setEditUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditDepartment(user.department);
    setEditClassGroup(user.classGroup);
    setEditSection(user.section);
    setEditBatch(user.batch);
    setEditError("");
    setEditing(false);
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setEditError("");
    setEditing(true);
    try {
      await updateUser({
        userId: editUser.id,
        fullName: editName,
        email: editEmail,
        role: editRole,
        department: editDepartment || undefined,
        classGroup: editClassGroup || undefined,
        section: editSection || undefined,
        batch: editBatch || undefined,
      });
      setEditUser(null);
      const fresh = await getInstitutionUsers();
      setUsers(fresh);
    } catch (err: any) {
      setEditError(err?.message || "Failed to update user");
    } finally {
      setEditing(false);
    }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading users...</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Users className="h-5 w-5 text-[#e28774]" /> All Users
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Manage all users in the institution</p>
      </div>

      <div className="flex gap-2 items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-black bg-[#f4ebd0] p-2 pl-9 text-xs font-bold" />
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 border-2 border-black bg-[#e28774] px-4 py-2 text-xs font-black text-white hover:bg-[#d97766]">
          <Plus className="h-3.5 w-3.5" /> Add User
        </button>
      </div>

      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] overflow-x-auto">
        <table className="w-full border-collapse text-xs font-bold">
          <thead>
            <tr className="border-b-2 border-black bg-[#1a1a14] text-[#f4ebd0] text-[10px] uppercase">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Last Login</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center font-black">No users found.</td></tr>
            ) : filtered.map((u) => (
              <tr key={u.id} className="border-b border-black">
                <td className="p-3 font-black">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 uppercase text-[10px]">{u.role.replace("_", " ")}</td>
                <td className="p-3">{u.department}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 text-[10px] font-black uppercase ${u.status === "Active" ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"}`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-3 text-[10px]">{u.lastLogin}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    {u.role !== "institution_admin" && (
                      <>
                        <button onClick={() => openEditModal(u)}
                          className="p-1.5 border border-black bg-blue-200 hover:bg-blue-300"
                          title="Edit user">
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button onClick={() => handleToggleStatus(u.id, u.status)}
                          className={`p-1.5 border border-black ${u.status === "Active" ? "bg-red-200 hover:bg-red-300" : "bg-green-200 hover:bg-green-300"}`}
                          title={u.status === "Active" ? "Suspend" : "Activate"}>
                          {u.status === "Active" ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                        </button>
                        <button onClick={() => { setRoleChangeId(u.id); setRoleChangeValue(u.role); }}
                          className="p-1.5 border border-black bg-amber-200 hover:bg-amber-300"
                          title="Change role">
                          <Shield className="h-3 w-3" />
                        </button>
                        <button onClick={() => setDeleteId(u.id)}
                          className="p-1.5 border border-black bg-red-200 hover:bg-red-300"
                          title="Delete user">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </>
                    )}
                    {u.role === "institution_admin" && (
                      <span className="text-[10px] font-bold text-gray-500 italic">Protected</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role change modal */}
      {roleChangeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setRoleChangeId(null)}>
          <div className="w-full max-w-sm border-2 border-black bg-[#f4ebd0] p-6 shadow-[6px_6px_0px_0px_#1a1a14]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-black uppercase mb-4">Change Role</h3>
            <select value={roleChangeValue} onChange={(e) => setRoleChangeValue(e.target.value)}
              className="w-full border-2 border-black bg-white p-2 text-xs font-bold mb-4">
              {roleOptions.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            {roleChangeError && <p className="text-xs font-bold text-red-600">{roleChangeError}</p>}
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setRoleChangeId(null); setRoleChangeError(""); }} className="border-2 border-black bg-white px-4 py-1.5 text-xs font-black hover:bg-[#eae3cb]">Cancel</button>
              <button onClick={() => roleChangeId && handleRoleChange(roleChangeId, roleChangeValue)} className="border-2 border-black bg-[#e28774] px-4 py-1.5 text-xs font-black text-white hover:bg-[#d97766]">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => !deleting && setDeleteId(null)}>
          <div className="w-full max-w-sm border-2 border-black bg-[#f4ebd0] p-6 shadow-[6px_6px_0px_0px_#1a1a14]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-black uppercase mb-2 text-red-600">Delete User</h3>
            <p className="text-xs font-bold mb-4">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteId(null)} disabled={deleting} className="border-2 border-black bg-white px-4 py-1.5 text-xs font-black hover:bg-[#eae3cb] disabled:opacity-40">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="border-2 border-black bg-red-600 px-4 py-1.5 text-xs font-black text-white hover:bg-red-700 disabled:opacity-40">{deleting ? "Deleting..." : "Delete"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add user modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-md border-2 border-black bg-[#f4ebd0] p-6 shadow-[6px_6px_0px_0px_#1a1a14]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-black uppercase mb-4">Add User</h3>
            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Full Name</label>
                <input type="text" required value={addName} onChange={(e) => setAddName(e.target.value)}
                  className="w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Email</label>
                <input type="email" required value={addEmail} onChange={(e) => setAddEmail(e.target.value)}
                  className="w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="john@institution.edu" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Role</label>
                <select value={addRole} onChange={(e) => setAddRole(e.target.value)}
                  className="w-full border-2 border-black bg-white p-2 text-xs font-bold">
                  {roleOptions.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Class / Course</label>
                <input type="text" value={addClassGroup} onChange={(e) => setAddClassGroup(e.target.value)}
                  className="w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="B.Tech, MBA, or leave blank" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1">Section</label>
                  <input type="text" value={addSection} onChange={(e) => setAddSection(e.target.value)}
                    className="w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="A, B, ..." />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1">Batch</label>
                  <input type="text" value={addBatch} onChange={(e) => setAddBatch(e.target.value)}
                    className="w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="2024-28" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Department</label>
                {!showNewDept ? (
                  <div className="flex gap-2">
                    <select value={addDepartment} onChange={(e) => setAddDepartment(e.target.value)}
                      className="flex-1 border-2 border-black bg-white p-2 text-xs font-bold">
                      <option value="">Select department...</option>
                      {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                    <button type="button" onClick={() => { setShowNewDept(true); setAddDepartment("__new__"); }}
                      className="border-2 border-black bg-[#eae3cb] px-3 text-xs font-black hover:bg-[#d9d2bb] whitespace-nowrap">+ New</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input type="text" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)}
                      className="w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="New department name" />
                    <button type="button" onClick={() => { setShowNewDept(false); setAddDepartment(""); }}
                      className="text-[10px] font-black text-[#e28774] hover:underline">Cancel</button>
                  </div>
                )}
              </div>
              {addError && <p className="text-xs font-bold text-red-600">{addError}</p>}
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowAdd(false)} disabled={adding} className="border-2 border-black bg-white px-4 py-1.5 text-xs font-black hover:bg-[#eae3cb] disabled:opacity-40">Cancel</button>
                <button type="submit" disabled={adding} className="border-2 border-black bg-[#e28774] px-4 py-1.5 text-xs font-black text-white hover:bg-[#d97766] disabled:opacity-40">{adding ? "Adding..." : "Add User"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit user modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => !editing && setEditUser(null)}>
          <div className="w-full max-w-md border-2 border-black bg-[#f4ebd0] p-6 shadow-[6px_6px_0px_0px_#1a1a14]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-black uppercase mb-4">Edit User</h3>
            <form onSubmit={handleEditUser} className="space-y-3">
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Full Name</label>
                <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Email</label>
                <input type="email" required value={editEmail} onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="john@institution.edu" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Role</label>
                <select value={editRole} onChange={(e) => setEditRole(e.target.value)}
                  className="w-full border-2 border-black bg-white p-2 text-xs font-bold">
                  {roleOptions.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Class / Course</label>
                <input type="text" value={editClassGroup} onChange={(e) => setEditClassGroup(e.target.value)}
                  className="w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="B.Tech, MBA, or leave blank" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1">Section</label>
                  <input type="text" value={editSection} onChange={(e) => setEditSection(e.target.value)}
                    className="w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="A, B, ..." />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1">Batch</label>
                  <input type="text" value={editBatch} onChange={(e) => setEditBatch(e.target.value)}
                    className="w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="2024-28" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Department</label>
                <select value={editDepartment} onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full border-2 border-black bg-white p-2 text-xs font-bold">
                  <option value="">Select department...</option>
                  {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              {editError && <p className="text-xs font-bold text-red-600">{editError}</p>}
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setEditUser(null)} disabled={editing} className="border-2 border-black bg-white px-4 py-1.5 text-xs font-black hover:bg-[#eae3cb] disabled:opacity-40">Cancel</button>
                <button type="submit" disabled={editing} className="border-2 border-black bg-[#e28774] px-4 py-1.5 text-xs font-black text-white hover:bg-[#d97766] disabled:opacity-40">{editing ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
