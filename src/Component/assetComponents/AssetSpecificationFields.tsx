/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

type Props = {
  assetType: string;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function AssetSpecificationFields({
  assetType,
  form,
  setForm,
}: Props) {
  const handleSpecChange = (key: string, value: string) => {
    setForm((prev: any) => ({
      ...prev,
      specifications: { ...prev.specifications, [key]: value },
    }));
  };

  switch (assetType) {
    case 'laptop':
      return (
        <>
          <Typography>Series</Typography>
          <TextField
            placeholder="Enter Series"
            fullWidth
            size="small"
            value={form.specifications.series}
            onChange={(e) => handleSpecChange('series', e.target.value)}
          />

          <Typography>Processor</Typography>
          <TextField
            placeholder="Enter Processor"
            fullWidth
            size="small"
            value={form.specifications.processor}
            onChange={(e) => handleSpecChange('processor', e.target.value)}
          />

          <Typography>RAM</Typography>
          <TextField
            placeholder="Enter RAM"
            fullWidth
            size="small"
            value={form.specifications.ram}
            onChange={(e) => handleSpecChange('ram', e.target.value)}
          />

          <Typography>Storage</Typography>
          <TextField
            placeholder="Enter Storage"
            fullWidth
            size="small"
            value={form.specifications.storage}
            onChange={(e) => handleSpecChange('storage', e.target.value)}
          />

          <Typography>Operating System</Typography>
          <TextField
            placeholder="Enter OS"
            fullWidth
            size="small"
            value={form.specifications.operatingSystem}
            onChange={(e) =>
              handleSpecChange('operatingSystem', e.target.value)
            }
          />

          <Typography>Screen Resolution</Typography>
          <TextField
            placeholder="Enter Screen Resolution"
            fullWidth
            size="small"
            value={form.specifications.screenResolution}
            onChange={(e) =>
              handleSpecChange('screenResolution', e.target.value)
            }
          />

          <Typography>Charger</Typography>
          <RadioGroup
            row
            value={form.specifications.charger}
            onChange={(e) => handleSpecChange('charger', e.target.value)}
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </>
      );

    case 'monitor':
      return (
        <>
          <Typography>Screen Resolution</Typography>
          <TextField
            placeholder="Enter Screen Resolution"
            fullWidth
            size="small"
            value={form.specifications.screenResolution}
            onChange={(e) =>
              handleSpecChange('screenResolution', e.target.value)
            }
          />
        </>
      );

    case 'harddrive':
    case 'pendrive':
      return (
        <>
          <Typography>Storage</Typography>
          <TextField
            placeholder="Enter Storage (e.g. 512GB SSD)"
            fullWidth
            size="small"
            value={form.specifications.storage}
            onChange={(e) => handleSpecChange('storage', e.target.value)}
          />
        </>
      );

    case 'mobile':
      return (
        <>
          <Typography>OS Type</Typography>
          <TextField
            placeholder="Enter OS Type (e.g. Android, iOS)"
            fullWidth
            size="small"
            value={form.specifications.osType}
            onChange={(e) => handleSpecChange('osType', e.target.value)}
          />

          <Typography>RAM</Typography>
          <TextField
            placeholder="Enter RAM (e.g. 8GB)"
            fullWidth
            size="small"
            value={form.specifications.ram}
            onChange={(e) => handleSpecChange('ram', e.target.value)}
          />

          <Typography>IMEI 1</Typography>
          <TextField
            placeholder="Enter IMEI 1"
            fullWidth
            size="small"
            value={form.specifications.imei1}
            onChange={(e) => handleSpecChange('imei1', e.target.value)}
          />

          <Typography>IMEI 2</Typography>
          <TextField
            placeholder="Enter IMEI 2"
            fullWidth
            size="small"
            value={form.specifications.imei2}
            onChange={(e) => handleSpecChange('imei2', e.target.value)}
          />
        </>
      );

    case 'sim':
      return (
        <>
          <Typography>Phone</Typography>
          <TextField
            placeholder="Enter Phone"
            fullWidth
            size="small"
            value={form.specifications.phone}
            onChange={(e) => handleSpecChange('phone', e.target.value)}
          />

          <Typography>Sim No.</Typography>
          <TextField
            placeholder="Enter Sim No."
            fullWidth
            size="small"
            value={form.specifications.simNo}
            onChange={(e) => handleSpecChange('simNo', e.target.value)}
          />
        </>
      );

    case 'accessories':
      return (
        <>
          <Typography>Type</Typography>
          <RadioGroup
            row
            value={form.specifications.accessoriesType}
            onChange={(e) =>
              handleSpecChange('accessoriesType', e.target.value)
            }
          >
            <FormControlLabel value="cable" control={<Radio />} label="Cable" />
            <FormControlLabel value="ram" control={<Radio />} label="Ram" />
            <FormControlLabel
              value="keyboard"
              control={<Radio />}
              label="Keyboard"
            />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>

          {form.specifications.accessoriesType === 'ram' && (
            <>
              <Typography>Capacity</Typography>
              <TextField
                placeholder="Enter Capacity"
                fullWidth
                size="small"
                value={form.specifications.capacity}
                onChange={(e) =>
                  handleSpecChange('capacity', e.target.value)
                }
              />
            </>
          )}

          <Typography>Remark</Typography>
          <TextField
            placeholder="Remark"
            fullWidth
            size="small"
            value={form.specifications.remark}
            onChange={(e) => handleSpecChange('remark', e.target.value)}
          />
        </>
      );

    default:
      return null;
  }
}
