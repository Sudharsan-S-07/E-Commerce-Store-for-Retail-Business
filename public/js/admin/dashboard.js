requireAdmin();

let salesChartInst = null;

async function loadDashboard() {
  try {
    const stats = await apiFetch('/dashboard/stats');
    
    // Shopify formatting
    document.getElementById('totOrders').textContent = stats.total_orders;
    document.getElementById('totRevenue').textContent = '₹' + parseFloat(stats.total_revenue).toLocaleString('en-IN');
    document.getElementById('totSessions').textContent = parseInt(stats.simulated_sessions).toLocaleString('en-IN');
    document.getElementById('totConversion').textContent = stats.conversion_rate + '%';
    
    // Recent Orders Table
    const tbody = document.getElementById('recentOrdersTbody');
    if(stats.recent_orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 24px;">No recent activity in this period.</td></tr>';
    } else {
      tbody.innerHTML = stats.recent_orders.map(o => `
        <tr>
          <td style="font-weight:600; color:#008060;">#${o.id + 1000}</td>
          <td style="font-weight:500;">${o.customer_name}</td>
          <td>${new Date(o.created_at).toLocaleDateString()}</td>
          <td style="font-weight:600;">₹${parseFloat(o.total_amount).toLocaleString('en-IN')}</td>
          <td><span style="background: #e3f1df; padding: 4px 8px; border-radius: 12px; font-weight: 600; font-size:12px; color:#008060;">${o.status}</span></td>
        </tr>
      `).join('');
    }
    
    // Initialize Chart.js Line Chart
    if(stats.sales_chart) {
      const ctx = document.getElementById('salesChart').getContext('2d');
      if (salesChartInst) salesChartInst.destroy();
      
      salesChartInst = new Chart(ctx, {
        type: 'line',
        data: {
          labels: stats.sales_chart.labels,
          datasets: [{
            label: 'Total Sales (₹)',
            data: stats.sales_chart.data,
            borderColor: '#008060',
            backgroundColor: 'rgba(0, 128, 96, 0.1)',
            borderWidth: 2,
            pointBackgroundColor: '#008060',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.3 // Smooth curves
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a1a1a',
              padding: 12,
              titleFont: { size: 13, family: 'Inter, sans-serif' },
              bodyFont: { size: 14, weight: 'bold', family: 'Inter, sans-serif' },
              callbacks: {
                label: function(context) {
                  return '₹' + parseFloat(context.parsed.y).toLocaleString('en-IN');
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false, drawBorder: false },
              ticks: { font: { family: 'Inter, sans-serif', size: 12 }, color: '#616161' }
            },
            y: {
              grid: { color: '#e5e5e5', borderDash: [4, 4], drawBorder: false },
              ticks: { 
                font: { family: 'Inter, sans-serif', size: 12 }, 
                color: '#616161',
                callback: function(val) { return '₹' + val.toLocaleString('en-IN'); }
              },
              beginAtZero: true
            }
          }
        }
      });
    }

  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', loadDashboard);
