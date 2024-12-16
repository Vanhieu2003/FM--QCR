import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import Label from 'src/components/label';
import Logo from 'src/components/logo';
import { VERSION } from 'src/config-global';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const { user } = useMockedUser();

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack spacing={0.5} sx={{ mb: 2, mt: 1.5, width: 1, display: 'flex', flexDirection: 'column', gap: '1', alignItems: 'center' }}>
        <Logo />
        <Typography
          variant="subtitle2"
          noWrap
          sx={{ color: 'var(--layout-nav-text-primary-color)' }}
        >
          FMEDU
        </Typography>

        <Typography
          variant="body2"
          noWrap
          sx={{ color: 'var(--layout-nav-text-disabled-color)' }}
        >
          Version {VERSION}
        </Typography>
      </Stack>
    </Stack>
  );
}
