
function TicketTable({ tickets, onViewAll }) {
  return (
    <section className="tickets-panel">
      <div className="panel-heading">
        <div>
          <h2>Recent tickets</h2>
          <p>Track the latest incidents reported to your team.</p>
        </div>

        <button className="secondary-button" onClick={onViewAll}>
          View all
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assignee</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>
                  <div className="ticket-title">{ticket.title}</div>
                  <div className="ticket-id">{ticket.id}</div>
                </td>
                <td>{ticket.category}</td>
                <td>
                  <span className={`priority ${ticket.priority.toLowerCase()}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td>
                  <span
                    className={`status ${ticket.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td>{ticket.assignee}</td>
              </tr>
            ))}

            {tickets.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-state">
                  No tickets match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        Showing {tickets.length} tickets
      </div>
    </section>
  );
}

export default TicketTable;
