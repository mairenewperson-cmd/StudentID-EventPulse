const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/event');
const Registration = require('../models/registration');

// 1. POST /api/registrations - Register for an event
async function registerForEvent(req, res) {
  try {
    const userId = req.user?.userId;

    // Check if body or event ID is missing
    if (!req.body || !req.body.event) {
      return res.status(400).json({ 
        message: 'Missing "event" field in request body. Ensure request body is valid JSON.' 
      });
    }

    const eventId = req.body.event;

    // Validate if eventId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid Event ID format' });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is already registered
    const existing = await Registration.findOne({
      event: eventId,
      attendee: userId,
    });
    if (existing) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Check event capacity
    const currentCount = await Registration.countDocuments({ event: eventId });
    if (currentCount >= event.capacity) {
      return res.status(400).json({ message: 'This event is full' });
    }

    // Create registration
    const registration = await Registration.create({
      event: eventId,
      attendee: userId,
    });

    return res.status(201).json(registration);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// 2. GET /api/registrations/my - Get user's registrations
async function getMyRegistrations(req, res) {
  try {
    const userId = req.user?.userId;

    const registrations = await Registration.find({ attendee: userId })
      .populate('event');

    return res.status(200).json(registrations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// 3. DELETE /api/registrations/:id - Cancel a registration
async function cancelRegistration(req, res) {
  try {
    const userId = req.user?.userId;
    const registrationId = req.params.id;

    // Validate if registrationId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      return res.status(400).json({ message: 'Invalid Registration ID format' });
    }

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Ownership check: Ensure user owns the registration
    if (registration.attendee.toString() !== userId) {
      return res.status(403).json({ message: 'You can only cancel your own registration' });
    }

    await registration.deleteOne();

    return res.status(200).json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
};