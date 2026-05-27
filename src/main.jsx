import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Brain, TrendingUp, PoundSterling, Users, Search, Filter, AlertTriangle, MousePointerClick, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './styles.css';

const campaigns = [
  { id: 1, name: 'Google Search - Manchester Plumbers', channel: 'Google Ads', spend: 1240, revenue: 4620, conversions: 66, clicks: 2180, status: 'Scale' },
  { id: 2, name: 'Meta Retargeting - Ecommerce', channel: 'Meta Ads', spend: 880, revenue: 2460, conversions: 42, clicks: 3510, status: 'Optimise' },
  { id: 3, name: 'TikTok Prospecting - Skincare', channel: 'TikTok Ads', spend: 1125, revenue: 1410, conversions: 25, clicks: 4980, status: 'Pause' },
  { id: 4, name: 'Email Winback - Shopify Customers', channel: 'Email', spend: 190, revenue: 1760, conversions: 54, clicks: 920, status: 'Scale' }
];

const monthlyData = [
  { month: 'Jan', spend: 2100, revenue: 6100, conversions: 120 },
  { month: 'Feb', spend: 2600, revenue: 7600, conversions: 148 },
  { month: 'Mar', spend: 3100, revenue: 9400, conversions: 176 },
  { month: 'Apr', spend: 3550, revenue: 10300, conversions: 193 },
  { month: 'May', spend: 3435, revenue: 10250, conversions: 187 },
  { month: 'Jun', spend: 3670, revenue: 11840, conversions: 212 }
];

function currency(value) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value);
}

function metrics(data) {
  const spend = data.reduce((s, c) => s + c.spend, 0);
  const revenue = data.reduce((s, c) => s + c.revenue, 0);
  const conversions = data.reduce((s, c) => s + c.conversions, 0);
  const clicks = data.reduce((s, c) => s + c.clicks, 0);
  return { spend, revenue, conversions, clicks, roas: revenue / spend, cac: spend / conversions, conversionRate: (conversions / clicks) * 100 };
}

function recommendations(data) {
  return data.map((campaign) => {
    const roas = campaign.revenue / campaign.spend;
    const cac = campaign.spend / campaign.conversions;
    if (roas >= 3.5) return { type: 'Growth', priority: 'High', title: `Increase budget for ${campaign.name}`, text: `ROAS is ${roas.toFixed(1)}x with CAC at ${currency(cac)}. Scale by 15–25% while monitoring conversion quality.` };
    if (roas < 1.5) return { type: 'Risk', priority: 'High', title: `Reduce spend on ${campaign.name}`, text: `ROAS is only ${roas.toFixed(1)}x. Review targeting, creative, landing page, or pause the campaign.` };
    return { type: 'Optimisation', priority: 'Medium', title: `Improve ${campaign.name}`, text: `ROAS is ${roas.toFixed(1)}x. Test ad copy, offer strength, and segmented landing pages.` };
  });
}

function MetricCard({ title, value, subtext, Icon }) {
  return <div className="card metric"><div><p className="muted">{title}</p><h2>{value}</h2><small>{subtext}</small></div><span className="icon"><Icon size={22}/></span></div>;
}

function App() {
  const [search, setSearch] = useState('');
  const [channel, setChannel] = useState('all');
  const filtered = useMemo(() => campaigns.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) && (channel === 'all' || c.channel === channel)), [search, channel]);
  const shown = filtered.length ? filtered : campaigns;
  const m = metrics(shown);
  const recs = recommendations(shown).slice(0, 4);

  return <main>
    <section className="hero">
      <div>
        <div className="pill"><Brain size={16}/> InsightFlow AI</div>
        <h1>AI Marketing Intelligence for SMEs</h1>
        <p>Connect campaigns, track ROI, identify wasted spend, and receive recommendations that help small businesses make better marketing decisions.</p>
      </div>
      <button>Connect data source</button>
    </section>

    <section className="grid four">
      <MetricCard title="Revenue tracked" value={currency(m.revenue)} subtext="Across selected campaigns" Icon={PoundSterling}/>
      <MetricCard title="Ad spend" value={currency(m.spend)} subtext="Current reporting period" Icon={Target}/>
      <MetricCard title="ROAS" value={`${m.roas.toFixed(2)}x`} subtext="Revenue divided by spend" Icon={TrendingUp}/>
      <MetricCard title="CAC" value={currency(m.cac)} subtext="Cost per customer acquired" Icon={Users}/>
    </section>

    <section className="grid two-one">
      <div className="card">
        <h2>Performance trend</h2><p className="muted">Monthly spend and revenue performance.</p>
        <div className="chart"><ResponsiveContainer><LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis/><Tooltip formatter={(v,n)=>n==='conversions'?v:currency(v)}/><Line type="monotone" dataKey="revenue" strokeWidth={3}/><Line type="monotone" dataKey="spend" strokeWidth={3}/></LineChart></ResponsiveContainer></div>
      </div>
      <div className="card">
        <h2><Brain size={20}/> AI recommendations</h2>
        <div className="stack">{recs.map((r, i) => <div className="rec" key={i}><div><b className={r.type.toLowerCase()}>{r.type}</b><small>{r.priority}</small></div><h3>{r.title}</h3><p>{r.text}</p></div>)}</div>
      </div>
    </section>

    <section className="grid two-one">
      <div className="card">
        <div className="tableHead"><div><h2>Campaign intelligence</h2><p className="muted">Search and filter active campaigns.</p></div><div className="controls"><label><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search campaigns"/></label><label><Filter size={16}/><select value={channel} onChange={e=>setChannel(e.target.value)}><option value="all">All</option><option>Google Ads</option><option>Meta Ads</option><option>TikTok Ads</option><option>Email</option></select></label></div></div>
        <table><thead><tr><th>Campaign</th><th>Spend</th><th>Revenue</th><th>ROAS</th><th>Action</th></tr></thead><tbody>{filtered.map(c => <tr key={c.id}><td><b>{c.name}</b><br/><small>{c.channel} • {c.clicks.toLocaleString()} clicks</small></td><td>{currency(c.spend)}</td><td>{currency(c.revenue)}</td><td>{(c.revenue/c.spend).toFixed(2)}x</td><td><span className="badge">{c.status}</span></td></tr>)}</tbody></table>
      </div>
      <div className="card">
        <h2><MousePointerClick size={20}/> Conversions by month</h2><p className="muted">Demand generation trend.</p>
        <div className="chart small"><ResponsiveContainer><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis/><Tooltip/><Bar dataKey="conversions" radius={[10,10,0,0]}/></BarChart></ResponsiveContainer></div>
        <div className="note"><AlertTriangle size={18}/> Live integrations with Google Ads, Meta, Shopify, and GA4 can be added after prototype validation.</div>
      </div>
    </section>
  </main>;
}

createRoot(document.getElementById('root')).render(<App/>);
