export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    CompositeTypes: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Tables: {
      Project: {
        Insert: {
          createdAt?: string;
          gridData: Json;
          hints?: Json;
          id: string;
          isPublic?: boolean;
          lastUpdatedBy?: string | null;
          name: string;
          ownerId: string;
          updatedAt: string;
          version?: number;
        };
        Relationships: [
          {
            columns: ['ownerId'];
            foreignKeyName: 'Project_ownerId_fkey';
            isOneToOne: false;
            referencedColumns: ['id'];
            referencedRelation: 'User';
          },
        ];
        Row: {
          createdAt: string;
          gridData: Json;
          hints: Json;
          id: string;
          isPublic: boolean;
          lastUpdatedBy: string | null;
          name: string;
          ownerId: string;
          updatedAt: string;
          version: number;
        };
        Update: {
          createdAt?: string;
          gridData?: Json;
          hints?: Json;
          id?: string;
          isPublic?: boolean;
          lastUpdatedBy?: string | null;
          name?: string;
          ownerId?: string;
          updatedAt?: string;
          version?: number;
        };
      };
      ProjectCollaborator: {
        Insert: {
          addedById: string;
          createdAt?: string;
          id: string;
          projectId: string;
          role?: string;
          status?: string;
          userId: string;
        };
        Relationships: [
          {
            columns: ['addedById'];
            foreignKeyName: 'ProjectCollaborator_addedById_fkey';
            isOneToOne: false;
            referencedColumns: ['id'];
            referencedRelation: 'User';
          },
          {
            columns: ['projectId'];
            foreignKeyName: 'ProjectCollaborator_projectId_fkey';
            isOneToOne: false;
            referencedColumns: ['id'];
            referencedRelation: 'Project';
          },
          {
            columns: ['userId'];
            foreignKeyName: 'ProjectCollaborator_userId_fkey';
            isOneToOne: false;
            referencedColumns: ['id'];
            referencedRelation: 'User';
          },
        ];
        Row: {
          addedById: string;
          createdAt: string;
          id: string;
          projectId: string;
          role: string;
          status: string;
          userId: string;
        };
        Update: {
          addedById?: string;
          createdAt?: string;
          id?: string;
          projectId?: string;
          role?: string;
          status?: string;
          userId?: string;
        };
      };
      User: {
        Insert: {
          email: string;
          id: string;
          rawUserMetaData: Json;
        };
        Relationships: [];
        Row: {
          email: string;
          id: string;
          rawUserMetaData: Json;
        };
        Update: {
          email?: string;
          id?: string;
          rawUserMetaData?: Json;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
