import { Button, Flex } from '@mantine/core';

type ZoomControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

export function ZoomControls({ onZoomIn, onZoomOut, canZoomIn, canZoomOut }: ZoomControlsProps) {
  return (
    <div className="zoom-controls">
      <Flex
      gap="md"
      justify="flex-start"
      align="flex-start"
      direction="column"
      wrap="wrap"
    >
      <Button variant="filled" color="gray" onClick={onZoomIn} disabled={!canZoomIn} aria-label="Увеличить">+</Button>
        <Button variant="filled" color="gray" onClick={onZoomOut} disabled={!canZoomOut} aria-label="Уменьшить">−</Button>
        </Flex>
    </div>
  );
}
