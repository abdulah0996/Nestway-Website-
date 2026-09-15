import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useDeferredValue, useState } from "react";
import { useForm } from "react-hook-form";
import { useSeo } from "../../hooks/useSeo.js";
import {
  AdminEmpty,
  AdminError,
  AdminModal,
  AdminPageHeader,
  AdminPanel,
  FieldLabel,
  PriorityBadge,
  StatusBadge,
  TableFrame,
  TableSkeleton,
  adminInputClass,
  tableCellClass,
  tableHeadClass,
} from "../components/AdminUi.jsx";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";
import {
  addLeadNote,
  assignLead,
  getAssignableConsultants,
  getCmsItems,
  getLeads,
  updateLeadFollowUp,
  updateLeadStatus,
} from "../services/adminApi.js";

const statuses = [
  "new",
  "contacted",
  "follow_up",
  "documents_pending",
  "application_started",
  "submitted",
  "approved",
  "rejected",
];
const consultantStatuses = [
  "contacted",
  "follow_up",
  "documents_pending",
  "application_started",
  "submitted",
];
const statusLabel = (value) =>
  value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const relatedName = (value) =>
  typeof value === "string" ? "Selected" : value?.name || "Not specified";
const fullName = (person) =>
  person
    ? `${person.firstName || ""} ${person.lastName || ""}`.trim()
    : "Unassigned";

function dateTimeInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

function compactParams(filters, search) {
  return Object.fromEntries(
    Object.entries({ ...filters, search, limit: 20 }).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined,
    ),
  );
}

export function LeadsPage() {
  useSeo({
    title: "Lead management",
    description: "Manage Nestway enquiries and assigned client progress.",
  });
  const { user } = useAdminAuth();
  const isAdmin = user?.role === "admin";
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    country: "",
    service: "",
    assignedTo: "",
    page: 1,
  });
  const [selectedLead, setSelectedLead] = useState(null);
  const [reminderAt, setReminderAt] = useState("");
  const search = useDeferredValue(filters.search);
  const params = compactParams(filters, search);
  const leadQueryKey = ["admin", "leads", params];
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const leadsQuery = useQuery({
    queryKey: leadQueryKey,
    queryFn: () => getLeads(params),
  });
  const countriesQuery = useQuery({
    queryKey: ["admin", "options", "countries"],
    queryFn: () => getCmsItems("countries"),
  });
  const servicesQuery = useQuery({
    queryKey: ["admin", "options", "services"],
    queryFn: () => getCmsItems("services"),
  });
  const consultantsQuery = useQuery({
    queryKey: ["admin", "consultants", "active"],
    queryFn: getAssignableConsultants,
    enabled: isAdmin,
  });
  const consultants = consultantsQuery.data || [];

  const optimisticallyUpdateLead = async (id, changes) => {
    await queryClient.cancelQueries({ queryKey: leadQueryKey });
    const previous = queryClient.getQueryData(leadQueryKey);
    queryClient.setQueryData(leadQueryKey, (current) =>
      current
        ? {
            ...current,
            items: current.items.map((lead) =>
              lead._id === id ? { ...lead, ...changes } : lead,
            ),
          }
        : current,
    );
    setSelectedLead((lead) =>
      lead?._id === id ? { ...lead, ...changes } : lead,
    );
    return previous;
  };

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateLeadStatus(id, status),
    onMutate: ({ id, status }) => optimisticallyUpdateLead(id, { status }),
    onError: (_error, _variables, previous) =>
      queryClient.setQueryData(leadQueryKey, previous),
    onSuccess: (updatedLead) =>
      setSelectedLead((lead) =>
        lead?._id === updatedLead._id ? updatedLead : lead,
      ),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "leads"] }),
  });

  const assignmentMutation = useMutation({
    mutationFn: ({ id, assignedTo }) => assignLead(id, assignedTo),
    onMutate: ({ id, assignedTo }) =>
      optimisticallyUpdateLead(id, {
        assignedTo:
          consultants.find((person) => person._id === assignedTo) || null,
      }),
    onError: (_error, _variables, previous) =>
      queryClient.setQueryData(leadQueryKey, previous),
    onSuccess: (updatedLead) =>
      setSelectedLead((lead) =>
        lead?._id === updatedLead._id ? updatedLead : lead,
      ),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "leads"] }),
  });

  const noteMutation = useMutation({
    mutationFn: ({ id, body }) => addLeadNote(id, body),
    onSuccess: (updatedLead) => {
      setSelectedLead(updatedLead);
      reset();
      queryClient.invalidateQueries({ queryKey: ["admin", "leads"] });
    },
  });

  const followUpMutation = useMutation({
    mutationFn: ({ id, followUpReminderAt }) =>
      updateLeadFollowUp(id, followUpReminderAt),
    onSuccess: (updatedLead) => {
      setSelectedLead(updatedLead);
      setReminderAt(dateTimeInputValue(updatedLead.followUpReminderAt));
      queryClient.invalidateQueries({ queryKey: ["admin", "leads"] });
    },
  });

  const records = leadsQuery.data?.items || [];
  const pagination = leadsQuery.data?.pagination;
  const updateFilter = (key, value) =>
    setFilters((current) => ({
      ...current,
      [key]: value,
      page: key === "page" ? value : 1,
    }));
  const visibleStatuses = isAdmin ? statuses : consultantStatuses;
  const mutationError =
    statusMutation.error ||
    assignmentMutation.error ||
    noteMutation.error ||
    followUpMutation.error;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-7"
    >
      <AdminPageHeader
        eyebrow="Client pipeline"
        title={isAdmin ? "Lead management" : "My assigned clients"}
        description={
          isAdmin
            ? "Search, segment, assign and progress every enquiry from one secure workspace."
            : "Follow up with your assigned clients, record notes and keep each application moving."
        }
        action={
          <div className="rounded-full bg-[#0B1F3A] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-[#0B1F3A]/10">
            {pagination?.total || 0} active records
          </div>
        }
      />

      <AdminPanel className="p-5 sm:p-6">
        <div
          className={`grid gap-4 md:grid-cols-2 ${isAdmin ? "xl:grid-cols-5" : "xl:grid-cols-4"}`}
        >
          <FieldLabel label="Search">
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
              <input
                type="search"
                value={filters.search}
                onChange={(event) => updateFilter("search", event.target.value)}
                placeholder="Name, email or phone"
                className={`${adminInputClass} pl-11`}
              />
            </div>
          </FieldLabel>
          <FieldLabel label="Status">
            <select
              value={filters.status}
              onChange={(event) => updateFilter("status", event.target.value)}
              className={adminInputClass}
            >
              <option value="">All statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel label="Country">
            <select
              value={filters.country}
              onChange={(event) => updateFilter("country", event.target.value)}
              className={adminInputClass}
            >
              <option value="">All countries</option>
              {(countriesQuery.data || []).map((country) => (
                <option key={country._id} value={country._id}>
                  {country.name}
                </option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel label="Service">
            <select
              value={filters.service}
              onChange={(event) => updateFilter("service", event.target.value)}
              className={adminInputClass}
            >
              <option value="">All services</option>
              {(servicesQuery.data || []).map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </select>
          </FieldLabel>
          {isAdmin && (
            <FieldLabel label="Assigned to">
              <select
                value={filters.assignedTo}
                onChange={(event) =>
                  updateFilter("assignedTo", event.target.value)
                }
                className={adminInputClass}
              >
                <option value="">All consultants</option>
                {consultants.map((person) => (
                  <option key={person._id} value={person._id}>
                    {fullName(person)}
                  </option>
                ))}
              </select>
            </FieldLabel>
          )}
        </div>
      </AdminPanel>

      {mutationError && <AdminError message={mutationError.message} />}

      <AdminPanel>
        {leadsQuery.isPending ? (
          <TableSkeleton columns={10} />
        ) : leadsQuery.isError ? (
          <div className="p-5">
            <AdminError
              message={leadsQuery.error?.message}
              onRetry={() => leadsQuery.refetch()}
            />
          </div>
        ) : records.length ? (
          <TableFrame>
            <thead>
              <tr>
                {[
                  "Name",
                  "Email",
                  "Phone",
                  "Interested country",
                  "Service",
                  "Status",
                  "Priority",
                  "Assigned to",
                  "Created date",
                  "Actions",
                ].map((heading) => (
                  <th key={heading} className={tableHeadClass}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((lead, index) => (
                <motion.tr
                  key={lead._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.025, 0.25) }}
                  className="group transition-colors hover:bg-slate-50/80"
                >
                  <td className={tableCellClass}>
                    <p className="whitespace-nowrap font-bold">
                      {lead.firstName} {lead.lastName}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[.1em] text-slate-400">
                      {lead.source?.replaceAll("_", " ") || "website"}
                    </p>
                  </td>
                  <td className={tableCellClass}>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-xs text-slate-600 hover:text-[#967719]"
                    >
                      {lead.email}
                    </a>
                  </td>
                  <td
                    className={`${tableCellClass} whitespace-nowrap text-xs text-slate-600`}
                  >
                    {lead.phone || "Not provided"}
                  </td>
                  <td className={`${tableCellClass} whitespace-nowrap`}>
                    {relatedName(lead.interestedCountry)}
                  </td>
                  <td className={`${tableCellClass} whitespace-nowrap`}>
                    {relatedName(lead.interestedService)}
                  </td>
                  <td className={tableCellClass}>
                    <select
                      value={lead.status}
                      aria-label={`Update status for ${lead.firstName}`}
                      disabled={statusMutation.isPending}
                      onChange={(event) =>
                        statusMutation.mutate({
                          id: lead._id,
                          status: event.target.value,
                        })
                      }
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#0B1F3A] outline-none transition focus:border-[#D4AF37]"
                    >
                      {!visibleStatuses.includes(lead.status) && (
                        <option value={lead.status}>
                          {statusLabel(lead.status)}
                        </option>
                      )}
                      {visibleStatuses.map((status) => (
                        <option key={status} value={status}>
                          {statusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={tableCellClass}>
                    <PriorityBadge priority={lead.priority} />
                  </td>
                  <td className={tableCellClass}>
                    {isAdmin ? (
                      <select
                        value={lead.assignedTo?._id || ""}
                        aria-label={`Assign ${lead.firstName}`}
                        disabled={
                          assignmentMutation.isPending ||
                          consultantsQuery.isPending
                        }
                        onChange={(event) =>
                          assignmentMutation.mutate({
                            id: lead._id,
                            assignedTo: event.target.value || null,
                          })
                        }
                        className="min-w-44 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#0B1F3A] outline-none transition focus:border-[#D4AF37]"
                      >
                        <option value="">Unassigned</option>
                        {consultants.map((person) => (
                          <option key={person._id} value={person._id}>
                            {fullName(person)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="whitespace-nowrap text-xs font-semibold text-slate-600">
                        {fullName(lead.assignedTo)}
                      </span>
                    )}
                  </td>
                  <td
                    className={`${tableCellClass} whitespace-nowrap text-xs text-slate-500`}
                  >
                    <time dateTime={lead.createdAt}>
                      {new Date(lead.createdAt).toLocaleDateString("en", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                  </td>
                  <td className={tableCellClass}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLead(lead);
                        setReminderAt(
                          dateTimeInputValue(lead.followUpReminderAt),
                        );
                      }}
                      className="rounded-full border border-[#0B1F3A]/15 px-4 py-2 text-xs font-bold text-[#0B1F3A] transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
                    >
                      Open
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </TableFrame>
        ) : (
          <AdminEmpty
            title="No leads match these filters"
            description="Adjust your search or filters to see more of the pipeline."
          />
        )}
        {pagination?.pages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 p-5">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => updateFilter("page", pagination.page - 1)}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold disabled:opacity-30"
            >
              Previous
            </button>
            <span className="text-xs text-slate-500">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              type="button"
              disabled={pagination.page >= pagination.pages}
              onClick={() => updateFilter("page", pagination.page + 1)}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </AdminPanel>

      <AdminModal
        open={Boolean(selectedLead)}
        onClose={() => {
          setSelectedLead(null);
          setReminderAt("");
          reset();
        }}
        title={
          selectedLead
            ? `${selectedLead.firstName} ${selectedLead.lastName}`
            : "Lead details"
        }
      >
        {selectedLead && (
          <div className="space-y-6">
            <div className="grid gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">
                  Contact
                </p>
                <p className="mt-2 text-sm font-semibold text-[#0B1F3A]">
                  {selectedLead.email}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedLead.phone || "No phone provided"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">
                  Progress
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusBadge status={selectedLead.status} />
                  <PriorityBadge priority={selectedLead.priority} />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">
                  Contact timing
                </p>
                <p className="mt-2 text-xs font-semibold text-[#0B1F3A]">
                  Last contacted
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {selectedLead.lastContactedAt
                    ? new Date(selectedLead.lastContactedAt).toLocaleString()
                    : "Not contacted yet"}
                </p>
              </div>
            </div>
            {selectedLead.message && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">
                  Client message
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedLead.message}
                </p>
              </div>
            )}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                followUpMutation.mutate({
                  id: selectedLead._id,
                  followUpReminderAt: reminderAt
                    ? new Date(reminderAt).toISOString()
                    : null,
                });
              }}
              className="rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/[.07] p-5"
            >
              <FieldLabel label="Follow-up reminder">
                <input
                  type="datetime-local"
                  value={reminderAt}
                  onChange={(event) => setReminderAt(event.target.value)}
                  className={adminInputClass}
                />
              </FieldLabel>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={followUpMutation.isPending || !reminderAt}
                  className="rounded-full bg-[#0B1F3A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#17375f] disabled:opacity-40"
                >
                  {followUpMutation.isPending
                    ? "Saving reminder..."
                    : "Schedule follow-up"}
                </button>
                {selectedLead.followUpReminderAt && (
                  <button
                    type="button"
                    disabled={followUpMutation.isPending}
                    onClick={() =>
                      followUpMutation.mutate({
                        id: selectedLead._id,
                        followUpReminderAt: null,
                      })
                    }
                    className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-[#0B1F3A]"
                  >
                    Clear reminder
                  </button>
                )}
              </div>
              {selectedLead.followUpReminderAt && (
                <p className="mt-3 text-xs text-slate-600">
                  Current reminder: {new Date(selectedLead.followUpReminderAt).toLocaleString()}
                </p>
              )}
            </form>
            <div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">
                  Lead activity
                </p>
                <span className="text-xs text-slate-400">
                  {selectedLead.activities?.length || 0} events
                </span>
              </div>
              <ol className="mt-4 max-h-64 space-y-4 overflow-y-auto border-l border-slate-200 pl-5">
                {selectedLead.activities?.length ? (
                  selectedLead.activities
                    .slice()
                    .reverse()
                    .map((activity) => (
                      <li key={activity._id || activity.createdAt} className="relative">
                        <span className="absolute -left-[1.43rem] top-1.5 size-2.5 rounded-full border-2 border-white bg-[#D4AF37]" />
                        <p className="text-sm font-semibold text-[#0B1F3A]">
                          {activity.description}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {activity.actor ? `${fullName(activity.actor)} · ` : ""}
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </li>
                    ))
                ) : (
                  <li className="text-sm text-slate-400">
                    Activity will appear after the next CRM action.
                  </li>
                )}
              </ol>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">
                  CRM notes
                </p>
                <span className="text-xs text-slate-400">
                  {selectedLead.notes?.length || 0} notes
                </span>
              </div>
              <div className="mt-3 max-h-52 space-y-3 overflow-y-auto">
                {selectedLead.notes?.length ? (
                  selectedLead.notes
                    .slice()
                    .reverse()
                    .map((note) => (
                      <div
                        key={note._id || note.createdAt}
                        className="rounded-2xl border border-slate-100 p-4"
                      >
                        <p className="text-sm leading-6 text-slate-600">
                          {note.body}
                        </p>
                        <p className="mt-2 text-[10px] text-slate-400">
                          {fullName(note.author)} ·{" "}
                          {new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-400">
                    No notes recorded yet.
                  </p>
                )}
              </div>
            </div>
            <form
              onSubmit={handleSubmit(({ body }) =>
                noteMutation.mutate({ id: selectedLead._id, body }),
              )}
            >
              <FieldLabel label="Add follow-up note">
                <textarea
                  rows="4"
                  className={adminInputClass}
                  placeholder="Record the conversation, documents requested, or next action…"
                  {...register("body", {
                    required: "Enter a note before saving",
                    maxLength: {
                      value: 2000,
                      message: "Notes cannot exceed 2,000 characters",
                    },
                  })}
                />
              </FieldLabel>
              {errors.body && (
                <p className="mt-2 text-xs text-red-700">
                  {errors.body.message}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting || noteMutation.isPending}
                className="mt-4 rounded-full bg-[#0B1F3A] px-6 py-3 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#17375f] disabled:opacity-50"
              >
                {noteMutation.isPending ? "Saving note…" : "Save note"}
              </button>
            </form>
          </div>
        )}
      </AdminModal>
    </motion.div>
  );
}
