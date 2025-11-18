/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 11-18-2025
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class ExpertContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getExpertContacts(Id caseId) {
        if (caseId == null) return new List<Contact>();

        // Query only CaseTeamMembers for the given case and role 'Expert'
        
        List<CaseTeamMember> caseTeamMembers = [
            SELECT MemberId, Member.Name, Member.Email
            FROM CaseTeamMember
            WHERE TeamRole.Name IN ('Expert', 'Insured Person')
            AND ParentId = :caseId
            AND MemberId != null
        ];
        
         

        // Collect MemberIds that are Contacts
        Set<Id> contactIds = new Set<Id>();
        for (CaseTeamMember ctm : caseTeamMembers) {
            if (ctm.MemberId.getSObjectType() == Contact.SObjectType) {
                contactIds.add(ctm.MemberId);
            }
        }

        // Fetch Contact details in a single query
        List<Contact> contacts = new List<Contact>();
        if (!contactIds.isEmpty()) {
            contacts = [
                SELECT Id, Name, Email 
                FROM Contact 
                WHERE Id IN :contactIds
            ];
        }


        System.debug('Case ID: ' + caseId);
System.debug('Found CaseTeamMembers: ' + caseTeamMembers.size());
System.debug('Contact IDs: ' + contactIds);
System.debug('Contacts: ' + contacts);



        return contacts;
    }
}
