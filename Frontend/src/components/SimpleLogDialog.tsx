import { History } from "@mui/icons-material";
import { Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useState } from "react";

const SimpleLogDialog = (
  actionLog: { label: string; value: string; date: Date; remark?: string }[],
  dialogLabel: string
) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <IconButton
        color="error"
        onClick={() => setOpen(true)}
        title="Simple Action Log"
        sx={{ p: 0, m: 0 }}
      >
        <History
          style={{
            padding: "10px",
            background: "#FFF1F0",
            margin: "auto",
            borderRadius: "12%",
            color: "red",
          }}
        />
      </IconButton>

      <Dialog
        maxWidth="xs"
        fullWidth
        // width="250px"
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogContent>
          <Stack gap={2} justifyContent="center">
            <History
              style={{
                padding: "20px",
                background: "#FFF1F0",
                margin: "auto",
                borderRadius: "50%",
                color: "red",
                fontSize: "25px",
              }}
            />
            <Typography
              gutterBottom
              variant="body2"
              fontSize={18}
              align="center"
            >
              {dialogLabel}
            </Typography>
            {Array.isArray(actionLog) &&
              actionLog
                ?.filter((log) => log)
                ?.map((log, index) => (
                  <Stack key={index}>
                    {(log?.label || log?.value) && (
                      <Stack
                        direction={"row"}
                        gap={1}
                        alignItems={"baseline"}
                        justifyContent="space-between"
                      >
                        <Stack
                          direction={"row"}
                          gap={1}
                          alignItems={"baseline"}
                        >
                          {log?.label && (
                            <Typography
                              key={index}
                              gutterBottom
                              variant="body2"
                              align="center"
                            >
                              {log?.label}
                            </Typography>
                          )}
                          •
                          {log?.value && (
                            <Typography
                              key={index}
                              gutterBottom
                              variant="body2"
                              align="center"
                            >
                              {log?.value}
                            </Typography>
                          )}
                        </Stack>
                        {log?.date && (
                          <Typography
                            key={index}
                            gutterBottom
                            variant="body2"
                            align="center"
                          >
                            {new Date(log?.date)?.toLocaleString()}
                          </Typography>
                        )}
                      </Stack>
                    )}
                    {log?.remark && (
                      <Typography key={index} gutterBottom variant="body2">
                        {log?.remark}
                      </Typography>
                    )}
                    <Divider />
                  </Stack>
                ))}
          </Stack>
          <Stack direction={"row"} gap={2} pt={2}>
            <Button
              size="small"
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SimpleLogDialog;
