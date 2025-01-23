"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  RiBookLine, RiBookOpenLine, RiVideoLine,
  RiFileList3Line, RiCheckboxCircleLine, RiDraftFill
} from 'react-icons/ri';
import { FormationApi } from '@/services/apiService';
import { 
  getStats, 
  publishFormation, 
  unpublishFormation, 
  duplicateFormation 
} from '@/services/adminService';
import type { StatsResponse } from '@/services/adminService';
import StatsGrid from '@/components/admin/StatsGrid';
import FormationList from '@/components/admin/FormationList';
import BulkActions from '@/components/admin/BulkActions';
import SearchAndFilter from '@/components/admin/SearchAndFilter';
import { IFormation } from '@/models/Formation';

export default function AdminFormationsPage() {
  const router = useRouter();
  const [formations, setFormations] = useState<IFormation[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFormations, setSelectedFormations] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [formationsData, statsData] = await Promise.all([
          FormationApi.getAll(),
          getStats()
        ]);

        setFormations(formationsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredFormations = formations.filter(formation => {
    const matchesSearch = formation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formation.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || formation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handlePublish = async (formationId: string) => {
    try {
      await publishFormation(formationId);
      const updatedFormations = await FormationApi.getAll();
      setFormations(updatedFormations);
      const updatedStats = await getStats();
      setStats(updatedStats);
    } catch (error) {
      console.error('Error publishing formation:', error);
    }
  };

  const handleUnpublish = async (formationId: string) => {
    try {
      await unpublishFormation(formationId);
      const updatedFormations = await FormationApi.getAll();
      setFormations(updatedFormations);
      const updatedStats = await getStats();
      setStats(updatedStats);
    } catch (error) {
      console.error('Error unpublishing formation:', error);
    }
  };

  const handleDuplicate = async (formationId: string) => {
    try {
      await duplicateFormation(formationId);
      const updatedFormations = await FormationApi.getAll();
      setFormations(updatedFormations);
      const updatedStats = await getStats();
      setStats(updatedStats);
    } catch (error) {
      console.error('Error duplicating formation:', error);
    }
  };

  const handleDelete = async (formationId: string) => {
    try {
      await FormationApi.delete(formationId);
      const updatedFormations = await FormationApi.getAll();
      setFormations(updatedFormations);
      const updatedStats = await getStats();
      setStats(updatedStats);
    } catch (error) {
      console.error('Error deleting formation:', error);
    }
  };

  const handleBulkPublish = async () => {
    try {
      await Promise.all(selectedFormations.map(id => publishFormation(id)));
      const updatedFormations = await FormationApi.getAll();
      setFormations(updatedFormations);
      const updatedStats = await getStats();
      setStats(updatedStats);
      setSelectedFormations([]);
    } catch (error) {
      console.error('Error bulk publishing formations:', error);
    }
  };

  const handleBulkUnpublish = async () => {
    try {
      await Promise.all(selectedFormations.map(id => unpublishFormation(id)));
      const updatedFormations = await FormationApi.getAll();
      setFormations(updatedFormations);
      const updatedStats = await getStats();
      setStats(updatedStats);
      setSelectedFormations([]);
    } catch (error) {
      console.error('Error bulk unpublishing formations:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedFormations.map(id => FormationApi.delete(id)));
      const updatedFormations = await FormationApi.getAll();
      setFormations(updatedFormations);
      const updatedStats = await getStats();
      setStats(updatedStats);
      setSelectedFormations([]);
    } catch (error) {
      console.error('Error bulk deleting formations:', error);
    }
  };

  if (isLoading || !stats) {
    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-dark/50 rounded-lg w-1/4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-dark/50 rounded-xl p-6 space-y-4">
                <div className="h-6 bg-dark-lighter rounded-lg w-1/2" />
                <div className="h-8 bg-dark-lighter rounded-lg w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion des formations</h1>
        <button
          onClick={() => router.push('/admin/formations/new')}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
        >
          Nouvelle formation
        </button>
      </div>

      <StatsGrid stats={[
        {
          title: 'Total des formations',
          value: stats.totalFormations,
          icon: RiBookLine,
          color: 'text-blue-500',
        },
        {
          title: 'Formations publiées',
          value: stats.publishedFormations,
          icon: RiCheckboxCircleLine,
          color: 'text-green-500',
        },
        {
          title: 'Formations en brouillon',
          value: stats.draftFormations,
          icon: RiDraftFill,
          color: 'text-yellow-500',
        },
        {
          title: 'Total des chapitres',
          value: stats.totalChapters,
          icon: RiBookOpenLine,
          color: 'text-purple-500',
        },
      ]} />

      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {selectedFormations.length > 0 && (
        <BulkActions
          selectedCount={selectedFormations.length}
          onPublish={handleBulkPublish}
          onUnpublish={handleBulkUnpublish}
          onDelete={handleBulkDelete}
        />
      )}

      <FormationList
        formations={filteredFormations}
        selectedFormations={selectedFormations}
        onSelectionChange={setSelectedFormations}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onEdit={(id) => router.push(`/admin/formations/${id}/edit`)}
      />
    </div>
  );
} 