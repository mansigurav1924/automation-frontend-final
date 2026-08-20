import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Briefcase, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function Candidates() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    api.get('/offers')
      .then(r => setOffers(r.data || []))
      .catch(() => setError('Failed to load candidates.'))
      .finally(() => setLoading(false));
  }, []);

  const departments = ['All', ...new Set(offers.map(o => o.department).filter(Boolean))];
  const statuses = ['All', ...new Set(offers.map(o => o.status).filter(Boolean))];

  const filtered = offers
    .filter(o => {
      const q = search.toLowerCase();
      return (
        (o.candidate_name || '').toLowerCase().includes(q) ||
        (o.candidate_email || '').toLowerCase().includes(q)
      );
    })
    .filter(o => deptFilter === 'All' || o.department === deptFilter)
    .filter(o => statusFilter === 'All' || o.status === statusFilter);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--color-heading)', margin: 0, letterSpacing: '-0.025em' }}>Candidates</h1>
          <p style={{ color: 'var(--color-body)', margin: '0.3rem 0 0', fontSize: '0.875rem' }}>{filtered.length} offer{filtered.length !== 1 ? 's' : ''} found.</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select className="form-input" style={{ width: 150, fontSize: '0.82rem' }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
            {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
          </select>
          <select className="form-input" style={{ width: 130, fontSize: '0.82rem' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
          </select>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2rem', width: 220, fontSize: '0.82rem' }}
              placeholder="Search name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#DC2626' }}>{error}</div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-muted)' }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-muted)' }}>No candidates found.</div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(offer => (
            <motion.div key={offer.id} variants={itemVariants}>
              <Link to={`/offers/${offer.id}`} style={{ textDecoration: 'none' }}>
                <div
                  className="card"
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(27,20,69,0.10)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
                >
                  {/* Avatar */}
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-primary)' }}>
                      {(offer.candidate_name || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Name + email */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {offer.candidate_name || '—'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-body)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Mail size={11} /> {offer.candidate_email || '—'}
                    </div>
                  </div>

                  {/* Designation */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--color-body)', flexShrink: 0 }}>
                    <Briefcase size={13} color="var(--color-primary)" />
                    {offer.designation || '—'}
                  </div>

                  {/* Department */}
                  <span style={{ background: '#EDE9FF', color: 'var(--color-primary)', borderRadius: 9999, padding: '0.2rem 0.65rem', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>
                    {offer.department || '—'}
                  </span>

                  {/* Date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--color-muted)', flexShrink: 0 }}>
                    <Calendar size={12} />
                    {new Date(offer.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>

                  {/* Status */}
                  <StatusBadge status={offer.status} />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    Sent:    { bg: '#D1FAE5', color: '#059669' },
    Failed:  { bg: '#FEE2E2', color: '#DC2626' },
    Pending: { bg: '#FEF3C7', color: '#D97706' },
  };
  const c = colors[status] || { bg: '#F1F5F9', color: '#64748B' };
  return (
    <span style={{ background: c.bg, color: c.color, borderRadius: 9999, padding: '0.2rem 0.65rem', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>
      {status || 'Unknown'}
    </span>
  );
}
