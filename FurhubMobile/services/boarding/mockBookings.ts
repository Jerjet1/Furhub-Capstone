import { cebuWalkers } from "@/services/walkers/walkers";

export const mockBookings: any[] = []; // all bookings
export const mockWalkerBookings: any[] = []; // approved bookings for walkers
export const mockNotifications: any[] = []; // notifications for walkers

let bookingCount = 0;

// Add a new booking (by owner)
export function addBooking(facility: any, ownerId: string, walkerId: string) {
  bookingCount++;
  const now = new Date();

  const booking = {
    id: Date.now().toString(),
    facility,
    ownerId,
    walkerId,
    status: bookingCount === 1 ? "Pending" : "Approved", // first booking pending
    amount: facility.pricePerNight ?? facility.pricePerHour ?? 500,
    checkIn: facility.checkIn ?? now,
    checkOut: facility.checkOut ?? new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
    notes: facility.notes ?? "",
    paymentMethod: null,
    timestamp: now.toISOString(),
  };

  mockBookings.push(booking);

  // Send notification to walker
  mockNotifications.push({
    id: Date.now().toString(),
    walkerId,
    bookingId: booking.id,
    message: `New booking request from Owner ${ownerId}`,
    read: false,
    timestamp: now.toISOString(),
  });

  // If status is Approved (bookingCount > 1), move to walker's active bookings
  if (booking.status === "Approved") {
    mockWalkerBookings.push(booking);
  }

  return booking;
}

// Pet Walker approves or cancels booking
export function updateBookingStatus(bookingId: string, status: "Approved" | "Cancelled") {
  const booking = mockBookings.find((b) => b.id === bookingId);
  if (!booking) return null;

  booking.status = status;

  // If approved, move to walker's active bookings
  if (status === "Approved" && !mockWalkerBookings.includes(booking)) {
    mockWalkerBookings.push(booking);
  }

  // Remove the notification
  const notifIndex = mockNotifications.findIndex((n) => n.bookingId === bookingId);
  if (notifIndex !== -1) mockNotifications.splice(notifIndex, 1);

  return booking;
}

// Get notifications for a walker
export function getWalkerNotifications(walkerId: string) {
  return mockNotifications.filter((n) => n.walkerId === walkerId);
}

// Get bookings for a walker (approved)
export function getWalkerBookings(walkerId: string) {
  return mockWalkerBookings.filter((b) => b.walkerId === walkerId);
}

// Get bookings for an owner
export function getOwnerBookings(ownerId: string) {
  return mockBookings.filter((b) => b.ownerId === ownerId);
}
