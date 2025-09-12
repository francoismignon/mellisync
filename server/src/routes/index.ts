import { Router } from 'express';

// Import de tous les modules de routes
import authRoutes from './auth.routes';
import apiaryRoutes from './apiary.routes';
import hiveRoutes from './hive.routes';
import visitRoutes from './visit.routes';
import actionRoutes from './action.routes';
import dashboardRoutes from './dashboard.routes';
import addressRoutes from './addressRoutes';
import testRoutes from './test';

const router = Router();

// Montage des routes par domaine métier
router.use('/auth', authRoutes);           // /api/auth/*
router.use('/apiaries', apiaryRoutes);     // /api/apiaries/*
router.use('/hives', hiveRoutes);          // /api/hives/*
router.use('/visits', visitRoutes);        // /api/visits/*
router.use('/actions', actionRoutes);      // /api/actions/*
router.use('/dashboard', dashboardRoutes); // /api/dashboard/*
router.use('/addresses', addressRoutes);   // /api/addresses/*
router.use('/test', testRoutes);           // /api/test/*

export default router;