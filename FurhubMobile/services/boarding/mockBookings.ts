// services/boarding/mockBookings.ts
export type Booking = {
  id: number;
  facility: any; // Boarding facility info
  ownerId: string; // Pet owner
  walkerId?: string; // Assigned walker (optional)
  checkIn: Date;
  checkOut: Date;
  notes: string;
  status: "Pending" | "Approved" | "Cancelled" | "Completed";
  createdAt: Date;
};

export type Notification = {
  id: number;
  bookingId: number;
  walkerId?: string;
  message: string;
  createdAt: Date;
  for: "owner" | "walker";
};

export const mockBookings: Booking[] = []; // all bookings
export const mockWalkerBookings: Booking[] = []; // approved for walkers
export const mockNotifications: Notification[] = []; // notifications

let bookingCount = 0;
let notifCount = 0;

// ➕ Add new booking (by Owner → Boarding)
export function addBooking({
  facility,
  ownerId = "owner1", // default for now, replace with auth later
  walkerId = "walker1", // can be null if not yet assigned
  checkIn,
  checkOut,
  notes,
}: {
  facility: any;
  ownerId?: string;
  walkerId?: string;
  checkIn: Date;
  checkOut: Date;
  notes: string;
}): Booking {
  bookingCount++;

  const newBooking: Booking = {
    id: bookingCount,
    facility,
    ownerId,
    walkerId,
    checkIn,
    checkOut,
    notes,
    status: "Pending",
    createdAt: new Date(),
  };

  mockBookings.push(newBooking);

  // notify boarding/walker
  notifCount++;
  mockNotifications.push({
    id: notifCount,
    bookingId: newBooking.id,
    message: `New booking request for ${facility.name}`,
    createdAt: new Date(),
    for: "walker",
  });

  return newBooking;
}

// 🔄 Update booking status
export function updateBookingStatus(
  bookingId: number,
  status: "Approved" | "Cancelled" | "Completed"
) {
  const booking = mockBookings.find((b) => b.id === bookingId);
  if (!booking) return;

  booking.status = status;

  // If approved, also add to walkerBookings
  if (status === "Approved") {
    mockWalkerBookings.push(booking);
  }

  // Add notification for owner
  notifCount++;
  mockNotifications.push({
    id: notifCount,
    bookingId,
    message: `Your booking has been ${status}`,
    createdAt: new Date(),
    for: "owner",
  });
}

// 📩 Get notifications for Owner
export function getOwnerNotifications(ownerId: string) {
  return mockNotifications.filter((n) =>
    mockBookings.some((b) => b.id === n.bookingId && b.ownerId === ownerId)
  );
}

// 📩 Get notifications for Walker
export function getWalkerNotifications(walkerId: string) {
  return mockNotifications.filter((n) =>
    mockBookings.some((b) => b.id === n.bookingId && b.walkerId === walkerId)
  );
}
