import { useState, useMemo, useCallback, useEffect } from 'react';
import { Material, Stats, Notification } from '../types';
import { 
  calculateStats, 
  getOverdueMaterials, 
  generateNotifications, 
  storage, 
  generateId, 
  generateMaterialId 
} from '../utils/helpers';
import { sampleMaterials } from '../utils/sampleData';

const STORAGE_KEY = 'adnlrms_materials';

export const useMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>(() => {
    const stored = storage.get<Material[]>(STORAGE_KEY, []);
    return stored.length > 0 ? stored : sampleMaterials;
  });

  useEffect(() => {
    storage.set(STORAGE_KEY, materials);
  }, [materials]);

  const stats: Stats = useMemo(() => calculateStats(materials), [materials]);
  const overdueMaterials = useMemo(() => getOverdueMaterials(materials), [materials]);

  const addMaterial = useCallback((materialData: Omit<Material, 'id' | 'materialId' | 'uploadedAt'>) => {
    const newMaterial: Material = {
      ...materialData,
      id: generateId(),
      materialId: generateMaterialId(materials),
      uploadedAt: new Date(),
    };
    setMaterials(prev => [newMaterial, ...prev]);
    return newMaterial;
  }, [materials]);

  const updateMaterial = useCallback((id: string, updates: Partial<Material>) => {
    setMaterials(prev => prev.map(m => 
      m.id === id ? { ...m, ...updates, lastUpdated: new Date() } : m
    ));
  }, []);

  const deleteMaterial = useCallback((id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  }, []);

  return {
    materials,
    stats,
    overdueMaterials,
    addMaterial,
    updateMaterial,
    deleteMaterial,
  };
};

export const useNotifications = (materials: Material[], isAdmin: boolean) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications(generateNotifications(materials, isAdmin));
  }, [materials, isAdmin]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length, 
    [notifications]
  );

  return { notifications, markAsRead, clearAll, unreadCount };
};