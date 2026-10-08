import React from 'react';
import { ExternalLink, BookOpen, Video, Code, Compass, FileText } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ResourceItem, ResourceCategory } from '../../types';

export interface ResourceCardProps {
  resource: ResourceItem;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const getCategoryIcon = (category: ResourceCategory) => {
    switch (category) {
      case 'YouTube':
        return <Video className="w-3.5 h-3.5 text-[#DC2626]" />;
      case 'Official Documentation':
        return <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />;
      case 'Tutorials':
        return <Compass className="w-3.5 h-3.5 text-[#D97706]" />;
      case 'Examples':
        return <Code className="w-3.5 h-3.5 text-[#16A34A]" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-[#687280]" />;
    }
  };

  return (
    <Card hoverable className="flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <Badge
            variant="neutral"
            size="sm"
            icon={getCategoryIcon(resource.category)}
          >
            {resource.category}
          </Badge>
          <span className="text-[11px] font-semibold text-[#687280] bg-[#F3F4F6] px-2 py-0.5 rounded">
            {resource.technology}
          </span>
        </div>

        <h4 className="text-sm font-bold text-[#111827] group-hover:text-black mb-1.5 leading-snug">
          {resource.title}
        </h4>

        <p className="text-xs text-[#687280] leading-relaxed line-clamp-3 mb-4">
          {resource.description}
        </p>
      </div>

      <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs">
        <span className="text-[11px] text-[#9CA3AF]">
          {resource.readTimeOrDuration || 'Recommended Guide'}
        </span>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-[#111827] hover:underline cursor-pointer"
        >
          <span>Open Resource</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </Card>
  );
};
