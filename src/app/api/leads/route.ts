import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getOrganizationContext } from '@/lib/tenancy';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.clientName || !body.clientPhone) {
      return NextResponse.json({ error: 'Client name and phone number are required' }, { status: 400 });
    }

    const {
      propertyId,
      organizationId,
      clientName,
      clientEmail,
      clientPhone,
      message,
      source,
      budget
    } = body;

    let targetOrgId = organizationId;
    let targetAgentId = null;

    if (propertyId) {
      const prop = await db.property.findUnique({
        where: { id: propertyId },
        select: { organizationId: true, assignedAgentMemberId: true }
      });
      if (prop) {
        if (!targetOrgId && prop.organizationId) {
          targetOrgId = prop.organizationId;
        }
        targetAgentId = prop.assignedAgentMemberId;
      }
    }

    const lead = await db.lead.create({
      data: {
        organizationId: targetOrgId,
        propertyId,
        assignedAgentId: targetAgentId,
        clientName,
        clientEmail: clientEmail || '',
        clientPhone,
        message: message || '',
        source: source || 'PROPERTY_DETAIL',
        status: 'NEW_INQUIRY',
        budget: budget ? parseFloat(budget) : null,
        consentGiven: body.consentGiven ?? true,
        isUnlocked: false,
        unlockFeeKes: 200
      }
    });

    return NextResponse.json({
      message: 'Inquiry received successfully. An agent will contact you shortly.',
      leadId: lead.id
    });
  } catch (error: any) {
    console.error('Error submitting lead:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get('organizationId');

    const where: any = {};
    if (orgId) {
      where.organizationId = orgId;
    }

    const leads = await db.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          select: { title: true, price: true, town: true, slug: true }
        },
        assignedAgent: {
          select: { user: { select: { name: true } } }
        }
      }
    });

    // Apply Kenya Data Protection Act MSISDN masking for locked leads
    const sanitized = leads.map((l) => {
      let displayPhone = l.clientPhone;
      let displayEmail = l.clientEmail;

      if (!l.isUnlocked) {
        // Mask phone: e.g. +254 7••• ••890
        const raw = l.clientPhone.replace(/[^0-9]/g, '');
        if (raw.length >= 9) {
          const suffix = raw.slice(-3);
          displayPhone = `+254 7••• ••${suffix}`;
        } else {
          displayPhone = '+254 ••• •••';
        }
        displayEmail = '••••••@••••.com';
      }

      return {
        id: l.id,
        clientName: l.clientName,
        clientPhone: displayPhone,
        clientEmail: displayEmail,
        isUnlocked: l.isUnlocked,
        unlockFeeKes: l.unlockFeeKes,
        message: l.message,
        source: l.source,
        status: l.status,
        budget: l.budget,
        notes: l.notes,
        propertyTitle: l.property?.title || 'Direct Marketplace Inquiry',
        propertyPrice: l.property?.price,
        assignedAgent: l.assignedAgent?.user?.name || 'Unassigned',
        createdAt: l.createdAt
      };
    });

    return NextResponse.json({ success: true, leads: sanitized });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.leadId || !body.organizationId) {
      return NextResponse.json({ error: 'leadId and organizationId are required' }, { status: 400 });
    }

    const context = await getOrganizationContext(req, body.organizationId);
    if (!context) {
      return NextResponse.json({ error: 'Unauthorized tenant access' }, { status: 403 });
    }

    const { leadId, status, notes, assignedAgentId } = body;

    const existingLead = await db.lead.findUnique({
      where: { id: leadId }
    });

    if (!existingLead || existingLead.organizationId !== context.organization.id) {
      return NextResponse.json({ error: 'Lead not found in this organization' }, { status: 404 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (assignedAgentId !== undefined) updateData.assignedAgentId = assignedAgentId;

    const updated = await db.lead.update({
      where: { id: leadId },
      data: updateData
    });

    return NextResponse.json({
      message: 'Lead updated successfully',
      lead: updated
    });
  } catch (error: any) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
