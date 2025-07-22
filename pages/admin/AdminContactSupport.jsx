"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

const BACKENDURL =
  "https://chowspace-backend.vercel.app" || "http://localhost:2005";

const AdminContactSupport = () => {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Helper: get token safely
  const getToken = () => session?.user?.accessToken || "";

  const fetchTickets = async () => {
    try {
      if (!getToken()) return; // no token, do nothing

      const res = await axios.get(`${BACKENDURL}/api/support/tickets`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tickets");
    }
  };

  const fetchMessages = async (ticketId) => {
    try {
      if (!getToken()) return;

      const res = await axios.get(
        `${BACKENDURL}/api/admin/ticket/${ticketId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setMessages(res.data.messages || []);
      scrollToBottom();
    } catch (err) {
      console.error(err);
      toast.error("Failed to load messages");
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    fetchMessages(ticket._id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${BACKENDURL}/api/ticket/${selectedTicket._id}/reply`,
        { message: newMessage },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setMessages((prev) => [...prev, res.data.supportMessage]);
      setNewMessage("");
      scrollToBottom();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchTickets();
    }
  }, [session?.user?.accessToken]);

  return (
    <div className="flex h-screen">
      {/* Sidebar: ticket list */}
      <aside className="w-72 border-r border-gray-300 p-4 overflow-y-auto bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Support Tickets</h2>
        {tickets.length === 0 ? (
          <p className="text-gray-600">No tickets found</p>
        ) : (
          tickets.map((ticket) => (
            <button
              key={ticket._id}
              onClick={() => handleSelectTicket(ticket)}
              className={`w-full text-left px-3 py-2 mb-2 rounded ${
                selectedTicket?._id === ticket._id
                  ? "bg-[#AE2108] text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <p className="font-medium">{ticket.subject}</p>
              <p className="text-xs text-gray-600">Status: {ticket.status}</p>
            </button>
          ))
        )}
      </aside>

      {/* Chat area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#AE2108] text-white p-4">
          <h1 className="text-lg font-semibold">
            {selectedTicket
              ? `Ticket: ${selectedTicket.subject}`
              : "Select a ticket"}
          </h1>
        </header>

        {/* Messages */}
        <section
          ref={chatRef}
          className="flex-1 p-4 overflow-y-auto bg-white"
          style={{ minHeight: 0 }}
        >
          {!selectedTicket ? (
            <p className="text-gray-500">
              Please select a ticket to view messages
            </p>
          ) : messages.length === 0 ? (
            <p className="text-gray-500">No messages yet</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`max-w-3/4 mb-3 p-2 rounded ${
                  msg.senderModel === "Admin"
                    ? "bg-[#AE2108] text-white ml-auto"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p>{msg.message}</p>
                <small className="text-xs text-gray-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </section>

        {/* Send message input */}
        {selectedTicket && (
          <footer className="p-4 border-t flex items-center gap-2 bg-gray-100">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border rounded px-3 py-2 outline-none"
              placeholder="Type your reply..."
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-[#AE2108] text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              Send
            </button>
          </footer>
        )}
      </main>
    </div>
  );
};

export default AdminContactSupport;
