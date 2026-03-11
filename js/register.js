(() => {
  const form = document.getElementById('registration-form');
  const teamSize = document.getElementById('team-size');
  const member4Block = document.getElementById('member4-block');
  const member5Block = document.getElementById('member5-block');
  const alertBox = document.getElementById('form-alert');
  const confirmation = document.getElementById('confirmation');
  const confirmTeam = document.getElementById('confirm-team');
  const confirmId = document.getElementById('confirm-id');

  const phoneRegex = /^\+?\d{10,15}$/;

  const fields = {
    team_name: document.getElementById('team-name'),
    college_name: document.getElementById('college-name'),
    city: document.getElementById('city'),
    team_size: teamSize,
    leader_name: document.getElementById('leader-name'),
    leader_prn: document.getElementById('leader-prn'),
    leader_email: document.getElementById('leader-email'),
    leader_phone: document.getElementById('leader-phone'),
    leader_github: document.getElementById('leader-github'),
    alt_name: document.getElementById('alt-name'),
    alt_prn: document.getElementById('alt-prn'),
    alt_email: document.getElementById('alt-email'),
    alt_phone: document.getElementById('alt-phone'),
    member2_name: document.getElementById('member2-name'),
    member2_prn: document.getElementById('member2-prn'),
    member3_name: document.getElementById('member3-name'),
    member3_prn: document.getElementById('member3-prn'),
    member4_name: document.getElementById('member4-name'),
    member4_prn: document.getElementById('member4-prn'),
    member5_name: document.getElementById('member5-name'),
    member5_prn: document.getElementById('member5-prn')
  };

  const setRequired = (block, isRequired) => {
    block.querySelectorAll('input').forEach((input) => {
      if (isRequired) {
        input.setAttribute('required', 'required');
      } else {
        input.removeAttribute('required');
        input.value = '';
      }
    });
  };

  const updateMembers = () => {
    const size = parseInt(teamSize.value, 10);
    if (size >= 4) {
      member4Block.classList.remove('hidden');
      setRequired(member4Block, true);
    } else {
      member4Block.classList.add('hidden');
      setRequired(member4Block, false);
    }

    if (size === 5) {
      member5Block.classList.remove('hidden');
      setRequired(member5Block, true);
    } else {
      member5Block.classList.add('hidden');
      setRequired(member5Block, false);
    }
  };

  const showError = (message) => {
    alertBox.textContent = message;
    alertBox.classList.remove('hidden');
  };

  const clearError = () => {
    alertBox.textContent = '';
    alertBox.classList.add('hidden');
  };

  const validate = () => {
    clearError();

    if (!fields.team_name.value.trim()) {
      return 'Team name is required.';
    }

    const size = parseInt(fields.team_size.value, 10);
    if (![3, 4, 5].includes(size)) {
      return 'Team size must be between 3 and 5.';
    }

    if (!fields.leader_email.validity.valid) {
      return 'Enter a valid leader email address.';
    }

    if (!fields.alt_email.validity.valid) {
      return 'Enter a valid alternate email address.';
    }

    const leaderEmail = fields.leader_email.value.trim().toLowerCase();
    const altEmail = fields.alt_email.value.trim().toLowerCase();
    const leaderPhone = fields.leader_phone.value.trim();
    const altPhone = fields.alt_phone.value.trim();
    const leaderPrn = fields.leader_prn.value.trim().toLowerCase();
    const altPrn = fields.alt_prn.value.trim().toLowerCase();

    if (leaderEmail === altEmail || leaderPhone === altPhone || (leaderPrn && leaderPrn === altPrn)) {
      return 'Alternate contact must be different from the team leader (email/phone/PRN).';
    }

    if (!phoneRegex.test(leaderPhone)) {
      return 'Enter a valid leader phone number.';
    }

    if (!phoneRegex.test(altPhone)) {
      return 'Enter a valid alternate phone number.';
    }

    if (!fields.member2_name.value.trim() || !fields.member2_prn.value.trim()) {
      return 'Member 2 details are required.';
    }

    if (!fields.member3_name.value.trim() || !fields.member3_prn.value.trim()) {
      return 'Member 3 details are required.';
    }

    if (size >= 4) {
      if (!fields.member4_name.value.trim() || !fields.member4_prn.value.trim()) {
        return 'Member 4 details are required.';
      }
    }

    if (size === 5) {
      if (!fields.member5_name.value.trim() || !fields.member5_prn.value.trim()) {
        return 'Member 5 details are required.';
      }
    }

    return '';
  };

  const buildCsvRow = (data) => {
    return [
      data.team_name,
      data.college_name,
      data.city,
      data.team_size,
      data.leader_name,
      data.leader_prn,
      data.leader_email,
      data.leader_phone,
      data.leader_github,
      data.alt_name,
      data.alt_prn,
      data.alt_email,
      data.alt_phone,
      data.member2_name,
      data.member2_prn,
      data.member3_name,
      data.member3_prn,
      data.member4_name,
      data.member4_prn,
      data.member5_name,
      data.member5_prn,
      data.timestamp,
      data.payment_status
    ].map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',');
  };

  const storeCsv = (row) => {
    const header = [
      'team_name',
      'college_name',
      'city',
      'team_size',
      'leader_name',
      'leader_prn',
      'leader_email',
      'leader_phone',
      'leader_github',
      'alt_name',
      'alt_prn',
      'alt_email',
      'alt_phone',
      'member2_name',
      'member2_prn',
      'member3_name',
      'member3_prn',
      'member4_name',
      'member4_prn',
      'member5_name',
      'member5_prn',
      'timestamp',
      'payment_status'
    ].join(',');

    const key = 'ghc_registrations_csv';
    const existing = localStorage.getItem(key);
    const csv = existing ? `${existing}\n${row}` : `${header}\n${row}`;
    localStorage.setItem(key, csv);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'registrations.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getRegistrationId = () => {
    const key = 'ghc_reg_id_counter';
    const current = parseInt(localStorage.getItem(key) || '0', 10) + 1;
    localStorage.setItem(key, String(current));
    return `SYMHACK-${String(current).padStart(3, '0')}`;
  };

  teamSize.addEventListener('change', updateMembers);
  updateMembers();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const error = validate();
    if (error) {
      showError(error);
      return;
    }

    const payload = {
      team_name: fields.team_name.value.trim(),
      college_name: fields.college_name.value.trim(),
      city: fields.city.value.trim(),
      team_size: fields.team_size.value.trim(),
      leader_name: fields.leader_name.value.trim(),
      leader_prn: fields.leader_prn.value.trim(),
      leader_email: fields.leader_email.value.trim(),
      leader_phone: fields.leader_phone.value.trim(),
      leader_github: fields.leader_github.value.trim(),
      alt_name: fields.alt_name.value.trim(),
      alt_prn: fields.alt_prn.value.trim(),
      alt_email: fields.alt_email.value.trim(),
      alt_phone: fields.alt_phone.value.trim(),
      member2_name: fields.member2_name.value.trim(),
      member2_prn: fields.member2_prn.value.trim(),
      member3_name: fields.member3_name.value.trim(),
      member3_prn: fields.member3_prn.value.trim(),
      member4_name: fields.member4_name.value.trim(),
      member4_prn: fields.member4_prn.value.trim(),
      member5_name: fields.member5_name.value.trim(),
      member5_prn: fields.member5_prn.value.trim(),
      timestamp: new Date().toISOString(),
      payment_status: 'pending'
    };

    const csvRow = buildCsvRow(payload);
    storeCsv(csvRow);
    // TODO: Replace local CSV storage with Firebase storage in production.

    const regId = getRegistrationId();
    confirmTeam.textContent = payload.team_name;
    confirmId.textContent = regId;

    form.reset();
    updateMembers();
    form.classList.add('hidden');
    confirmation.classList.remove('hidden');
    clearError();
  });
})();
