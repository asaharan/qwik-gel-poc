CREATE MIGRATION m1hj7wqpmes72omco2pc3yclrze6ntfvexmosfqchumahxsqxznkza
    ONTO initial
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE SCALAR TYPE default::Role EXTENDING enum<Owner, Admin, Member>;
  CREATE FUTURE simple_scoping;
  CREATE TYPE default::OrgMember {
      CREATE REQUIRED PROPERTY role: default::Role;
  };
  CREATE TYPE default::Organization {
      CREATE MULTI LINK members: default::OrgMember {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY name: std::str;
  };
  ALTER TYPE default::OrgMember {
      CREATE REQUIRED LINK organization: default::Organization;
  };
  CREATE TYPE default::User {
      CREATE LINK membership: default::OrgMember;
      CREATE REQUIRED LINK identity: ext::auth::Identity {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY email: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY is_personal_account: std::bool;
      CREATE PROPERTY name: std::str;
      CREATE PROPERTY personal_details_complete: std::bool;
      CREATE PROPERTY phone: std::str;
  };
  ALTER TYPE default::OrgMember {
      CREATE REQUIRED LINK user: default::User {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
